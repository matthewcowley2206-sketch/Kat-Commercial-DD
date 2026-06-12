"use client";

import { useEffect, useRef, useCallback } from "react";
import type { SSEEvent } from "@/types";

export function useRealtime(
  projectId: string | null,
  onEvent: (event: SSEEvent) => void
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const stableCallback = useCallback((event: SSEEvent) => {
    onEventRef.current(event);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const eventSource = new EventSource(`/api/events/${projectId}`);

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as SSEEvent;
        stableCallback(event);
      } catch {
        // ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [projectId, stableCallback]);
}
