/** Simplified tiered stamp duty estimates for commercial property transfers. Indicative only. */

interface StampDutyBracket {
  upTo: number;
  rate: number;
  base: number;
}

const NSW_BRACKETS: StampDutyBracket[] = [
  { upTo: 14_000, rate: 1.25, base: 0 },
  { upTo: 32_000, rate: 1.5, base: 175 },
  { upTo: 85_000, rate: 1.75, base: 445 },
  { upTo: 319_000, rate: 3.5, base: 1_372 },
  { upTo: 1_064_000, rate: 4.5, base: 9_562 },
  { upTo: 3_194_000, rate: 5.5, base: 43_087 },
  { upTo: Infinity, rate: 7.0, base: 160_237 },
];

const VIC_BRACKETS: StampDutyBracket[] = [
  { upTo: 25_000, rate: 1.4, base: 0 },
  { upTo: 130_000, rate: 2.4, base: 350 },
  { upTo: 960_000, rate: 5.0, base: 2_870 },
  { upTo: 2_000_000, rate: 6.5, base: 44_370 },
  { upTo: Infinity, rate: 6.5, base: 111_970 },
];

function calculateTiered(price: number, brackets: StampDutyBracket[]): number {
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (price <= bracket.upTo) {
      const previousCap = i > 0 ? brackets[i - 1].upTo : 0;
      const excess = price - previousCap;
      return Math.round(bracket.base + (excess * bracket.rate) / 100);
    }
  }
  return Math.round(price * 0.055);
}

const FLAT_RATES: Record<string, number> = {
  QLD: 0.0525,
  WA: 0.05,
  SA: 0.055,
  TAS: 0.04,
  ACT: 0.045,
  NT: 0.05,
};

export function estimateStampDuty(price: number, state: string): number {
  if (price <= 0) return 0;

  switch (state) {
    case "NSW":
      return calculateTiered(price, NSW_BRACKETS);
    case "VIC":
      return calculateTiered(price, VIC_BRACKETS);
    default:
      return Math.round(price * (FLAT_RATES[state] ?? 0.055));
  }
}

export function getStampDutyNote(state: string): string {
  if (state === "NSW" || state === "VIC") {
    return `Tiered ${state} transfer duty estimate — confirm with your conveyancer`;
  }
  return `Flat ${state} rate estimate — confirm with your conveyancer`;
}
