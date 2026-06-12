export const copy = {
  app: {
    name: "Kat Commercial DD",
    tagline: "From property due diligence to lender-ready",
    badge: "Audit-ready",
  },
  home: {
    title: "Your properties, fully assessed",
    subtitle:
      "Upload documents, check Australian regulations, and see bankability — all in one calm, clear workflow.",
    newProject: "Start a project",
    viewDemo: "View example project",
    demoBanner: {
      title: "See a completed assessment",
      body: "Explore a finished due diligence on a Melbourne CBD office — documents, compliance checks, risk scores, and audit trail included.",
      cta: "Open example project",
      badge: "Example",
    },
    emptyTitle: "Begin with your first property",
    emptyBody:
      "Not sure where to start? Open the example project to see a full assessment, then create your own when you're ready.",
    stats: {
      projects: "Active projects",
      frameworks: "Regulatory frameworks",
      checks: "Compliance checks",
      learnMore: "Learn more",
      tapToExplore: "Tap to explore",
    },
    statsEducation: {
      projects: {
        title: (count: number) =>
          count === 1 ? "1 active project" : `${count} active projects`,
        intro:
          "Each project is a due diligence workspace for one commercial property. Kat walks you through five clear steps — from setup to a finished, audit-ready report.",
        steps: [
          {
            label: "Set up",
            body: "Add the property address, type, and purchase price so checks are tailored to your asset.",
          },
          {
            label: "Upload documents",
            body: "Provide financials, leases, valuations, environmental reports, and legal documents.",
          },
          {
            label: "Run analysis",
            body: "Kat automatically maps your documents to Australian regulatory requirements.",
          },
          {
            label: "Review compliance",
            body: "Work through each checklist item and record your verification decisions.",
          },
          {
            label: "Finalise report",
            body: "Review your risk score, compliance summary, and tamper-evident audit trail.",
          },
        ],
        cta: "Start a new project",
        viewDemo: "View the example project",
      },
      frameworks: {
        title: (count: number) =>
          `${count} regulatory framework${count === 1 ? "" : "s"}`,
        intro:
          "Australian commercial property deals touch several areas of law and regulation. Kat organises these into five frameworks so nothing important is missed.",
        visitWebsite: "Visit regulator website",
        items: {
          ncc: {
            name: "National Construction Code (NCC)",
            authority: "Australian Building Codes Board",
            websiteUrl: "https://ncc.abcb.gov.au/",
            websiteLabel: "Australian Building Codes Board",
            summary:
              "The building rulebook for commercial properties. Covers how the building is classified, fire safety, accessibility, energy efficiency, and structural integrity.",
            whyItMatters:
              "A buyer inherits compliance obligations — fire systems, access ramps, and energy ratings all need to be right.",
          },
          apra: {
            name: "APRA prudential standards",
            authority: "Australian Prudential Regulation Authority",
            websiteUrl: "https://www.apra.gov.au/",
            websiteLabel: "APRA",
            summary:
              "The lending safety rules banks follow when financing commercial property. Focuses on valuations, loan-to-value ratios, and whether rental income can withstand stress.",
            whyItMatters:
              "If you're borrowing, your lender will assess the deal against these standards. Weak numbers can mean harder finance terms.",
          },
          firb: {
            name: "FIRB foreign investment",
            authority: "Foreign Investment Review Board",
            websiteUrl: "https://foreigninvestment.gov.au/",
            websiteLabel: "FIRB",
            summary:
              "Checks whether foreign buyers need government approval before acquiring Australian commercial property, including vacant land and sensitive locations.",
            whyItMatters:
              "Missing a FIRB requirement can delay settlement or void a transaction entirely.",
          },
          environmental: {
            name: "Environmental & planning",
            authority: "State EPA and local council",
            websiteUrl: "https://www.dcceew.gov.au/environment",
            websiteLabel: "Department of Climate Change, Energy, the Environment and Water",
            summary:
              "Covers contamination risk, asbestos management, and whether the property's use matches its planning permit and zoning.",
            whyItMatters:
              "Environmental liabilities and planning breaches can cost millions to fix after you buy.",
          },
          lease: {
            name: "Lease & tenancy",
            authority: "State commercial leases legislation",
            websiteUrl: "https://www.business.gov.au/planning/new-businesses/choose-a-business-location/commercial-leases",
            websiteLabel: "business.gov.au — commercial leases",
            summary:
              "Reviews tenant leases for income stability — when leases expire, how rent is reviewed, and what make-good costs tenants owe at exit.",
            whyItMatters:
              "For income-producing assets, lease quality often drives value more than the bricks and mortar.",
          },
        },
      },
      checks: {
        title: (count: number) =>
          `${count} compliance check${count === 1 ? "" : "s"}`,
        intro:
          "Every project is assessed against a structured checklist drawn from the five regulatory frameworks. Each check maps to documents you upload — Kat flags what's covered and what still needs attention.",
        howItWorks: [
          "Upload your due diligence documents (financials, leases, valuations, environmental, legal).",
          "Kat matches each requirement to the documents on file.",
          "Items move from pending → in review → compliant as you verify them.",
          "Your risk score updates based on outstanding issues and severity.",
        ],
        priorityNote:
          "Checks are tagged by priority — critical items (like fire safety or FIRB approval) carry more weight in your risk score.",
      },
    },
    projectCard: {
      docs: (n: number) => `${n} document${n === 1 ? "" : "s"}`,
      checks: (n: number) => `${n} check${n === 1 ? "" : "s"}`,
      risk: "Risk score",
      delete: "Delete project",
    },
    delete: {
      title: "Delete this project?",
      body: (name: string) =>
        `"${name}" and all its documents, checks, and audit history will be permanently removed. This cannot be undone.`,
      confirm: "Delete project",
      cancel: "Keep project",
      deleting: "Deleting…",
      success: (name: string) => `"${name}" has been deleted.`,
      error: "We couldn't delete this project. Please try again.",
      demoProtected: "The example project cannot be deleted.",
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
      lenderReadiness: "Lender readiness",
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
    lenderReadiness: {
      title: "Lender readiness",
      subtitle: "From property due diligence to bankability — what lenders will scrutinise",
      bankability: "Bankability score",
      progress: (complete: number, total: number) =>
        `${complete} of ${total} areas complete`,
      indicative: "Indicative — confirm with lender BDM",
      levels: {
        strong: "Strong",
        adequate: "Adequate",
        marginal: "Marginal",
        weak: "Weak",
        pending: "Pending",
      },
      status: {
        not_started: "Not started",
        in_progress: "In progress",
        complete: "Complete",
      },
      viewDetails: "View details",
      metrics: {
        valuation: "Indicative valuation",
        loanAmount: "Loan amount (65% LVR)",
        noi: "Net operating income",
        assumptions: "Assumptions",
      },
      empty: "Upload financials and a valuation to calculate lending metrics.",
    },
    compliance: {
      summary: {
        pending:
          "Checklist generated. Upload remaining documents and verify each item before lender submission.",
        inReview:
          "Good progress. Documents are mapped to requirements — work through in-review items to strengthen your lender pack.",
        strong:
          "Strong compliance position. Most requirements verified and ready for lender review.",
        complete: "All regulatory checks verified. Compliance pack is lender-ready.",
        issues:
          "Compliance concerns flagged. Resolve non-compliant items before submitting to lenders.",
        notStarted:
          "Run analysis to build your regulatory checklist across five Australian frameworks.",
      },
      badges: {
        notStarted: "Not started",
        inProgress: "In progress",
        onTrack: "On track",
        complete: "Complete",
        needsAttention: "Needs attention",
      },
      drivers: {
        compliant: (n: number, total: number) => `${n} of ${total} checks verified`,
        inReview: (n: number) => `${n} check${n === 1 ? "" : "s"} awaiting verification`,
        issues: (n: number) => `${n} non-compliant item${n === 1 ? "" : "s"} flagged`,
        categoryRemaining: (name: string, n: number) =>
          `${name}: ${n} item${n === 1 ? "" : "s"} outstanding`,
      },
    },
    documents: {
      summary: {
        empty:
          "Upload financials, leases, valuations, environmental reports, and legal documents to begin due diligence.",
        starting:
          "Getting started. Add the core document types to unlock analysis and compliance checks.",
        partial:
          "Partial pack on file. Upload remaining document types to complete your lender submission pack.",
        complete:
          "Full document pack uploaded. All five core types on file for lender and compliance review.",
      },
      badges: {
        notStarted: "Not started",
        starting: "Getting started",
        partial: "Partial pack",
        complete: "Complete pack",
      },
      drivers: {
        onFile: (label: string, count: number) =>
          `${label} on file${count > 1 ? ` (${count} files)` : ""}`,
        missing: (label: string) => `Still needed: ${label}`,
        required: (label: string) => `Required: ${label}`,
      },
    },
    risk: {
      summary: {
        pending: "Run analysis after uploading documents to generate your risk score and summary.",
        levels: {
          low: "Low overall exposure. Key documents are on file and compliance items are largely verified — a solid position for lender review.",
          medium:
            "Moderate exposure. Documents are mostly in place but several checks still need broker verification before lender submission.",
          high:
            "Elevated exposure. Multiple compliance gaps or missing verifications may affect lender appetite and deal terms.",
          critical:
            "Significant risk flags. Critical items need resolution before approaching lenders or proceeding to settlement.",
        },
      },
      drivers: {
        nonCompliant: (n: number) =>
          `${n} item${n === 1 ? "" : "s"} flagged as non-compliant`,
        inReview: (n: number) =>
          `${n} check${n === 1 ? "" : "s"} awaiting your verification`,
        pending: (n: number) =>
          `${n} check${n === 1 ? "" : "s"} pending document review`,
        allCompliant: "All compliance checks verified",
        category: (name: string, score: number) =>
          `${name} contributing at ${score}/100`,
      },
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
    detail: {
      learnMore: "View details",
      tapToExplore: "Tap for breakdown",
      compliance: {
        title: "Compliance breakdown",
        intro:
          "A snapshot of your regulatory checklist. Items move from pending to in review as documents are uploaded, then to compliant once you verify them.",
        total: "Total checks",
        compliant: "Compliant",
        pending: "Pending",
        inReview: "In review",
        issues: "Issues",
        byCategory: "By framework",
        needsAttention: "Needs attention",
        noIssues: "No outstanding issues — great work.",
        empty: "Run analysis to generate your compliance checklist.",
        viewChecklist: "View full checklist",
        statusHelp: {
          compliant: "Verified and meeting requirements.",
          in_review: "Documents are on file — awaiting your verification.",
          pending: "Waiting on documents or review.",
          non_compliant: "Flagged as not meeting requirements.",
        },
      },
      documents: {
        title: "Document summary",
        intro:
          "Kat uses five core document types to run your regulatory checks. Upload what's available — we'll flag anything still missing.",
        onFile: "On file",
        stillNeeded: "Still needed",
        noFiles: "No documents uploaded yet.",
        uploadedAt: "Uploaded",
        viewUpload: "Add documents",
        fileCount: (n: number) => `${n} file${n === 1 ? "" : "s"}`,
      },
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
