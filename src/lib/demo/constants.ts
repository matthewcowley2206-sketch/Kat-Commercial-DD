export const DEMO_PROJECT_NAME = "Demo: 200 Collins Street";

export function isDemoProject(name: string): boolean {
  return name.startsWith("Demo:");
}
