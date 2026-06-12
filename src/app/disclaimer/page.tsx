import { LegalPageLayout } from "@/components/LegalPageLayout";
import { copy } from "@/lib/copy";

export default function DisclaimerPage() {
  const { disclaimers } = copy.legal;
  return (
    <LegalPageLayout
      title={disclaimers.title}
      updated={disclaimers.updated}
      intro={disclaimers.intro}
      sections={disclaimers.sections}
    />
  );
}
