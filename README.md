# Kat Commercial DD

Automated commercial real estate due diligence platform tailored to the Australian market. Gathers key property inputs, evaluates regulatory compliance (NCC, APRA, FIRB), scores risk, and produces an audit-ready dashboard with real-time updates.

## Features

- **Document Intake** — Upload financial statements, lease agreements, property valuations, environmental reports, and legal/compliance documents
- **Australian Regulatory Checklist** — 23 automated checks across NCC, APRA, FIRB, environmental, and lease frameworks
- **Risk Scoring** — Weighted multi-factor risk assessment with category breakdown
- **Automated Workflow** — 5-stage pipeline: intake → validation → regulatory check → risk scoring → reporting
- **Real-Time Dashboard** — Live updates via Server-Sent Events as documents are uploaded and analysis runs
- **Audit Trail** — Tamper-evident hash-chained audit log for every action
- **Data Security** — File hashing, MIME validation, AES-256-GCM encryption, security headers

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Seed demo project (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workflow

1. **Create a project** with property details (address, state, type, purchase price)
2. **Upload documents** across the five required categories
3. **Run Analysis** to trigger the automated workflow
4. **Review checklist** — mark items compliant/non-compliant as you verify
5. **Monitor risk** on the real-time dashboard
6. **Audit trail** — verify the integrity of all logged actions

## Regulatory Frameworks

| Framework | Authority | Checks |
|-----------|-----------|--------|
| NCC | Australian Building Codes Board | Building class, fire safety, accessibility, energy, structural |
| APRA | Australian Prudential Regulation Authority | Risk management, capital adequacy, collateral valuation, LVR, stress testing |
| FIRB | Foreign Investment Review Board | Foreign ownership, vacant land, national security, conditions |
| Environmental | State EPA / Council | Phase 1 ESA, asbestos, planning/zoning |
| Lease | State Commercial Leases Act | WALE, rent reviews, make-good |

Regulations are defined in `config/regulations.json` and can be updated without code changes.

## Architecture

```
config/regulations.json     ← Updatable regulatory rules
src/lib/regulations/        ← Checklist evaluation engine
src/lib/risk/               ← Risk scoring algorithm
src/lib/workflow/           ← Automated pipeline
src/lib/audit/              ← Hash-chained audit logging
src/lib/security/           ← Encryption & file validation
src/app/api/                ← REST + SSE endpoints
src/components/             ← Dashboard UI
```

## Security

- SHA-256 file hashing for document integrity
- AES-256-GCM encryption for sensitive metadata
- MIME type and file size validation on upload
- Hash-chained audit logs (tamper detection)
- Security headers (CSP, X-Frame-Options, etc.)
- Environment-based encryption keys (see `.env.example`)

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database path |
| `ENCRYPTION_KEY` | 32-byte hex key for AES encryption |
| `AUDIT_SECRET` | Secret for audit hash chain |

## Production Notes

- Replace SQLite with PostgreSQL for production scale
- Set strong `ENCRYPTION_KEY` and `AUDIT_SECRET` values
- Configure object storage (S3/Azure Blob) for document uploads
- Add authentication (NextAuth, Clerk, etc.)
- Enable HTTPS and rate limiting

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Prisma** (SQLite)
- **Tailwind CSS**
- **Recharts**
- **Zod** (validation)
