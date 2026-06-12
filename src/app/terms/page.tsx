import { LegalPageLayout } from "@/components/LegalPageLayout";
import { copy } from "@/lib/copy";

export default function TermsPage() {
  const { terms } = copy.legal;
  return (
    <LegalPageLayout
      title={terms.title}
      updated={terms.updated}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
