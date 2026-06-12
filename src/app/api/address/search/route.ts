import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

export interface AddressSuggestion {
  id: string;
  label: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  fullAddress: string;
}

function mapState(raw: string): string {
  const upper = raw.toUpperCase();
  if (AU_STATES.includes(upper as (typeof AU_STATES)[number])) return upper;
  const aliases: Record<string, string> = {
    "NEW SOUTH WALES": "NSW",
    VICTORIA: "VIC",
    QUEENSLAND: "QLD",
    "WESTERN AUSTRALIA": "WA",
    "SOUTH AUSTRALIA": "SA",
    TASMANIA: "TAS",
    "AUSTRALIAN CAPITAL TERRITORY": "ACT",
    "NORTHERN TERRITORY": "NT",
  };
  return aliases[upper] ?? upper;
}

async function searchGeoapify(query: string, apiKey: string): Promise<AddressSuggestion[]> {
  const params = new URLSearchParams({
    text: query,
    apiKey,
    filter: "countrycode:au",
    limit: "8",
    format: "json",
  });

  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?${params}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.features ?? []).map(
    (f: {
      properties: {
        place_id: string;
        formatted: string;
        address_line1?: string;
        address_line2?: string;
        street?: string;
        housenumber?: string;
        suburb?: string;
        city?: string;
        state?: string;
        state_code?: string;
        postcode?: string;
      };
    }) => {
      const p = f.properties;
      const street = p.address_line1 ?? p.street ?? "";
      const suburb = p.suburb ?? p.city ?? "";
      const state = mapState(p.state_code ?? p.state ?? "");
      const postcode = p.postcode ?? "";

      return {
        id: String(p.place_id),
        label: p.formatted,
        street,
        suburb,
        state,
        postcode,
        fullAddress: p.formatted,
      };
    }
  );
}

async function searchNominatim(query: string): Promise<AddressSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    countrycodes: "au",
    limit: "8",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent": "KatCommercialDD/1.0 (commercial property due diligence app)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.map(
    (item: {
      place_id: number;
      display_name: string;
      address?: {
        house_number?: string;
        road?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        postcode?: string;
      };
    }) => {
      const addr = item.address ?? {};
      const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
      const suburb = addr.suburb ?? addr.city ?? addr.town ?? addr.village ?? "";
      const state = mapState(addr.state ?? "");
      const postcode = addr.postcode ?? "";

      return {
        id: String(item.place_id),
        label: item.display_name,
        street,
        suburb,
        state,
        postcode,
        fullAddress: item.display_name,
      };
    }
  );
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const geoapifyKey = process.env.GEOAPIFY_API_KEY;
    const suggestions = geoapifyKey
      ? await searchGeoapify(query, geoapifyKey)
      : await searchNominatim(query);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Address search error:", error);
    return NextResponse.json({ suggestions: [], error: "Address search unavailable" });
  }
}
