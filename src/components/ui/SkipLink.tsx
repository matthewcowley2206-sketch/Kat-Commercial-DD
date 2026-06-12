import { copy } from "@/lib/copy";

export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      {copy.a11y.skipToMain}
    </a>
  );
}
