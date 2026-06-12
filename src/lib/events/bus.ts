import type { SSEEvent } from "@/types";

type EventListener = (event: SSEEvent) => void;

class EventBus {
  private listeners = new Map<string, Set<EventListener>>();

  subscribe(projectId: string, listener: EventListener): () => void {
    if (!this.listeners.has(projectId)) {
      this.listeners.set(projectId, new Set());
    }
    this.listeners.get(projectId)!.add(listener);

    return () => {
      this.listeners.get(projectId)?.delete(listener);
    };
  }

  emit(event: SSEEvent): void {
    const listeners = this.listeners.get(event.projectId);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }

    const globalListeners = this.listeners.get("*");
    if (globalListeners) {
      globalListeners.forEach((listener) => listener(event));
    }
  }
}

export const eventBus = new EventBus();

export function emitEvent(
  type: SSEEvent["type"],
  projectId: string,
  data: Record<string, unknown>
): void {
  eventBus.emit({
    type,
    projectId,
    data,
    timestamp: new Date().toISOString(),
  });
}
