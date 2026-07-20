import { onBeforeUnmount, ref } from 'vue';

export type ActionFeedbackKind = 'error' | 'success';

export interface TransientActionFeedback {
  id: string;
  kind: ActionFeedbackKind;
  message: string;
}

export function useTransientActionFeedback(duration = 2600) {
  const feedback = ref<TransientActionFeedback | null>(null);
  let timeout: ReturnType<typeof window.setTimeout> | null = null;

  function clear(): void {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    feedback.value = null;
  }

  function show(id: string, kind: ActionFeedbackKind, message: string): void {
    clear();
    feedback.value = { id, kind, message };
    timeout = window.setTimeout(clear, duration);
  }

  onBeforeUnmount(clear);

  return { clear, feedback, show };
}
