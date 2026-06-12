const PREFIX = "kat-onboarding-";

export type OnboardingFlag =
  | "dismissed"
  | "viewed-demo"
  | "explored-frameworks"
  | "created-project";

function key(flag: OnboardingFlag): string {
  return `${PREFIX}${flag}`;
}

export function getOnboardingFlag(flag: OnboardingFlag): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key(flag)) === "true";
}

export function setOnboardingFlag(flag: OnboardingFlag): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(flag), "true");
}

export function getOnboardingProgress(): {
  viewedDemo: boolean;
  exploredFrameworks: boolean;
  createdProject: boolean;
  dismissed: boolean;
} {
  return {
    viewedDemo: getOnboardingFlag("viewed-demo"),
    exploredFrameworks: getOnboardingFlag("explored-frameworks"),
    createdProject: getOnboardingFlag("created-project"),
    dismissed: getOnboardingFlag("dismissed"),
  };
}
