import { LegalPageLayout } from "@/components/LegalPageLayout";
import { copy } from "@/lib/copy";

export default function PrivacyPage() {
  const { privacy } = copy.legal;
  return (
    <LegalPageLayout
      title={privacy.title}
      updated={privacy.updated}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
