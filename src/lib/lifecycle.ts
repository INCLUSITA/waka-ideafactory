/**
 * Application lifecycle transitions — validated state machine.
 */

export type ApplicationStatus = "draft" | "active" | "paused" | "deprecated" | "archived";

const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ["active", "archived"],
  active: ["paused", "deprecated"],
  paused: ["active", "deprecated"],
  deprecated: ["archived"],
  archived: [],
};

export function getValidTransitions(current: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[current] ?? [];
}

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return getValidTransitions(from).includes(to);
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  paused: "Pausado",
  deprecated: "Deprecado",
  archived: "Archivado",
};
