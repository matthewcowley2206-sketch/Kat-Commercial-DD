"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2, Shield, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react";
import { isDemoProject } from "@/lib/demo/constants";
import { KatLogo } from "@/components/KatLogo";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { LiveRegion } from "@/components/ui/LiveRegion";
import { copy } from "@/lib/copy";
import { formatCurrency, getRiskBadgeClass, humanize } from "@/lib/utils";

interface ProjectSummary {
  id: string;
  name: string;
  propertyAddress: string;
  propertyType: string;
  state: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  purchasePrice: number | null;
  updatedAt: string;
  _count: { documents: number; checklistItems: number };
}

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [demoProjectId, setDemoProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setProjects(data.projects ?? data);
      setDemoProjectId(data.demoProjectId ?? null);
      setError(null);
    } catch {
      setError(
        "We couldn't reach the server. If this is a new deployment, connect a Postgres database in Vercel and redeploy."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <LiveRegion message={loading ? copy.a11y.loading : ""} />

      {/* Hero */}
      <section className="mb-8 sm:mb-10" aria-labelledby="home-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-4">
              <KatLogo size="lg" />
              <div>
                <p className="text-sm font-semibold text-brand-600">{copy.app.name}</p>
                <p className="text-xs text-slate-500">{copy.app.tagline}</p>
              </div>
            </div>
            <h1
              id="home-heading"
              className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {copy.home.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {copy.home.subtitle}
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            {demoProjectId && (
              <Link
                href={`/projects/${demoProjectId}`}
                className="btn-secondary w-full sm:w-auto"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                {copy.home.viewDemo}
              </Link>
            )}
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              {copy.home.newProject}
            </button>
          </div>
        </div>
      </section>

      {demoProjectId && (
        <section className="mb-8" aria-labelledby="demo-banner-heading">
          <Link
            href={`/projects/${demoProjectId}`}
            className="card group block border-brand-200 bg-gradient-to-br from-brand-50/80 to-white transition-all duration-200 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700" aria-hidden>
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      {copy.home.demoBanner.badge}
                    </span>
                  </div>
                  <h2 id="demo-banner-heading" className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                    {copy.home.demoBanner.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                    {copy.home.demoBanner.body}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
                {copy.home.demoBanner.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Stats */}
      <section className="mb-8 grid gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Overview statistics">
        <div className="card flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600" aria-hidden>
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{projects.length}</p>
            <p className="text-sm text-slate-500">{copy.home.stats.projects}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700" aria-hidden>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">5</p>
            <p className="text-sm text-slate-500">{copy.home.stats.frameworks}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700" aria-hidden>
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">23</p>
            <p className="text-sm text-slate-500">{copy.home.stats.checks}</p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="sr-only">
          Your projects
        </h2>

        {loading ? (
          <div className="card py-16 text-center" role="status">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" aria-hidden />
            <p className="mt-4 text-sm text-slate-500">{copy.a11y.loading}</p>
          </div>
        ) : error ? (
          <div className="card py-12 text-center" role="alert">
            <p className="text-base font-medium text-slate-900">Something went wrong</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{error}</p>
            <button type="button" className="btn-secondary mt-6" onClick={() => { setLoading(true); loadProjects(); }}>
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="card py-12 text-center sm:py-16">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100" aria-hidden>
              <Building2 className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{copy.home.emptyTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              {copy.home.emptyBody}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {demoProjectId && (
                <Link href={`/projects/${demoProjectId}`} className="btn-primary">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {copy.home.viewDemo}
                </Link>
              )}
              <button
                type="button"
                className={demoProjectId ? "btn-secondary" : "btn-primary"}
                onClick={() => setShowCreate(true)}
              >
                <Plus className="h-4 w-4" aria-hidden />
                {copy.home.newProject}
              </button>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="card group block h-full transition-all duration-200 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
                        {project.name}
                      </h3>
                      {isDemoProject(project.name) && (
                        <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                          {copy.home.demoBanner.badge}
                        </span>
                      )}
                    </div>
                    <span className={getRiskBadgeClass(project.riskLevel)}>
                      {humanize(project.riskLevel)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {project.propertyAddress}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {project.state} · {humanize(project.propertyType)}
                  </p>
                  {project.purchasePrice && (
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      {formatCurrency(project.purchasePrice)}
                    </p>
                  )}
                  <dl className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div>
                      <dt className="sr-only">Documents</dt>
                      <dd>{copy.home.projectCard.docs(project._count.documents)}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Checks</dt>
                      <dd>{copy.home.projectCard.checks(project._count.checklistItems)}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">{copy.home.projectCard.risk}</dt>
                      <dd>{copy.home.projectCard.risk}: {project.riskScore}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            window.location.href = `/projects/${id}`;
          }}
        />
      )}
    </div>
  );
}
