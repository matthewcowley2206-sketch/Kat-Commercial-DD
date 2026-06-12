"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface KatLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: 36, img: 36 },
  md: { box: 44, img: 44 },
  lg: { box: 80, img: 80 },
};

export function KatLogo({ size = "md", className }: KatLogoProps) {
  const { box, img } = sizes[size];

  return (
    <div
      className={cn("kat-logo relative shrink-0", className)}
      style={{ width: box, height: box }}
      aria-hidden
    >
      <div className="kat-logo-glow absolute inset-0 rounded-2xl" />
      <div className="kat-logo-float relative h-full w-full">
        <Image
          src="/kat-logo.png"
          alt=""
          width={img}
          height={img}
          className="h-full w-full rounded-2xl object-cover shadow-sm"
          priority
        />
        <span className="kat-calculator-pulse absolute bottom-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-brand-600 text-[6px] font-bold text-white">
          =
        </span>
      </div>
    </div>
  );
}
