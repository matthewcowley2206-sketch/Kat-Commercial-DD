export const copy = {
  app: {
    name: "Kat Commercial DD",
    tagline: "Empowering Confident Commercial decisions",
    badge: "Audit-ready",
  },
  home: {
    title: "Your properties, fully assessed",
    subtitle:
      "Upload documents, check Australian regulations, and see risk — all in one calm, clear workflow.",
    newProject: "Start a project",
    emptyTitle: "Begin with your first property",
    emptyBody:
      "Tell us about the asset. We'll walk you through uploads, compliance checks, and your final report.",
    stats: {
      projects: "Active projects",
      frameworks: "Regulatory frameworks",
      checks: "Compliance checks",
    },
    projectCard: {
      docs: (n: number) => `${n} document${n === 1 ? "" : "s"}`,
      checks: (n: number) => `${n} check${n === 1 ? "" : "s"}`,
      risk: "Risk score",
    },
  },
  create: {
    title: "New property assessment",
    subtitle: "Step 1 of 5 — a few details to get started",
    fields: {
      name: { label: "Project name", hint: "Something you'll recognise later", placeholder: "200 Collins Street acquisition" },
      address: { label: "Property address", hint: "Start typing — select from Australian address suggestions", placeholder: "200 Collins Street, Melbourne VIC 3000" },
      type: { label: "Property type", hint: "Helps tailor compliance checks" },
      state: { label: "State or territory", hint: "Regulations vary by jurisdiction" },
      price: { label: "Purchase price", hint: "Optional — used for risk assessment", placeholder: "e.g. 45000000" },
    },
    cancel: "Cancel",
    submit: "Create project",
    submitting: "Creating…",
    success: "Project created. Let's gather your documents.",
    error: "We couldn't create the project. Check that a database is connected in Vercel Storage.",
  },
  journey: {
    steps: {
      setup: { label: "Set up", short: "Set up" },
      upload: { label: "Upload documents", short: "Upload" },
      analyse: { label: "Run analysis", short: "Analyse" },
      review: { label: "Review compliance", short: "Review" },
      complete: { label: "Finalise report", short: "Complete" },
    },
    hints: {
      setup: "Your project is ready. Next, upload the key documents for this property.",
      upload: "Add financials, leases, valuations, environmental reports, and legal documents. We'll tell you what's still needed.",
      analyse: "Documents are in. Run analysis to generate your regulatory checklist and risk score.",
      review: "Work through each compliance item. Mark items as you verify them.",
      complete: "You're nearly done. Review your audit trail and export when ready.",
    },
    encouragement: {
      setup: "Great start — most teams begin right here.",
      upload: (remaining: number) =>
        remaining > 0
          ? `${remaining} document type${remaining === 1 ? "" : "s"} still needed. You're making progress.`
          : "All required documents uploaded. Ready for analysis.",
      analyse: "Analysis takes a few seconds. We'll update your dashboard live.",
      review: (done: number, total: number) =>
        total > 0
          ? `${done} of ${total} items reviewed. Keep going — you're doing well.`
          : "Run analysis first to generate your checklist.",
      complete: "Assessment complete. Every action is recorded in your audit trail.",
    },
    cta: {
      setup: "Upload documents",
      upload: "Continue uploading",
      analyse: "Run analysis",
      review: "Review checklist",
      complete: "View audit trail",
    },
  },
  dashboard: {
    back: "All projects",
    runAnalysis: "Run analysis",
    running: "Analysing…",
    tabs: {
      overview: "Overview",
      checklist: "Checklist",
      audit: "Audit trail",
    },
    sections: {
      risk: "Risk score",
      compliance: "Compliance at a glance",
      documents: "Documents",
      riskBreakdown: "Risk by category",
      workflow: "Analysis progress",
      upload: "Add a document",
      activity: "Recent activity",
      checklist: "Regulatory checklist",
      audit: "Audit trail",
    },
    empty: {
      risk: "Run analysis to see your risk score",
      checklist: "Upload documents and run analysis to build your checklist",
      activity: "Activity will appear here as you work",
      audit: "Loading audit trail…",
    },
    workflow: {
      intake: "Gathering documents",
      validation: "Validating files",
      regulatory_check: "Checking regulations",
      risk_scoring: "Calculating risk",
      reporting: "Preparing report",
    },
  },
  upload: {
    title: "Add a document",
    typeLabel: "What are you uploading?",
    dropzone: "Drop a file here, or choose one",
    formats: "PDF, Excel, Word, or CSV · 10 MB max",
    uploading: "Uploading…",
    success: (name: string) => `${name} uploaded successfully`,
    error: "Upload failed. Check the file type and size, then try again.",
    missing: "Still needed",
  },
  checklist: {
    columns: { item: "Requirement", priority: "Priority", status: "Status", action: "Update status" },
    status: {
      pending: "Pending",
      in_review: "In review",
      compliant: "Compliant",
      non_compliant: "Non-compliant",
      not_applicable: "Not applicable",
    },
  },
  audit: {
    valid: "Integrity verified",
    invalid: "Integrity issue detected",
    entries: (n: number) => `${n} recorded action${n === 1 ? "" : "s"}`,
  },
  a11y: {
    skipToMain: "Skip to main content",
    loading: "Loading projects",
    closeDialog: "Close dialog",
    progressLabel: "Due diligence progress",
    liveUpdates: "Dashboard updates",
  },
} as const;
