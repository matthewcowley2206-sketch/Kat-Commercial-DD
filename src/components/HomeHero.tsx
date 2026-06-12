"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { copy } from "@/lib/copy";

interface HomeHeroProps {
  onStartProject: () => void;
}

export function HomeHero({ onStartProject }: HomeHeroProps) {
  const { hero } = copy.home;

  return (
    <section
      className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm sm:mb-10"
      aria-labelledby="home-heading"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[420px]">
          <Image
            src="/images/hero-commercial-team.jpg"
            alt={hero.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/10"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="text-sm font-semibold text-brand-600">{copy.app.name}</p>
          <h1
            id="home-heading"
            className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {copy.home.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
            {copy.home.subtitle}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Key capabilities">
            {hero.highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <button type="button" className="btn-primary w-full sm:w-auto" onClick={onStartProject}>
              <Plus className="h-4 w-4" aria-hidden />
              {copy.home.newProject}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
