// Devin's own session mode decides whether it asks before running shell
// commands: in "bypass" and "smart" it runs them without sending
// session/request_permission, so BB never gets to ask. This gate refuses a
// turn that would run in one of those modes unless the thread's BB
// permission mode is "full", keeping BB's accept-edits promise.

// Devin modes that run commands without asking the client.
const UNGUARDED_MODES = new Set(["bypass", "smart"]);
// Devin starts every new or reloaded session in this mode.
const DEFAULT_MODE = "accept-edits";
// "mode" is Devin's config option; BB names the ACP-modes fallback
// "_bb/legacy-mode" (only offered when an agent has no mode option).
const MODE_OPTION_IDS = ["mode", "_bb/legacy-mode"];

export interface Refusal {
  id: string | number;
  message: string;
}

export function createDevinModeGate() {
  const modeByThread = new Map<string, string>();

  return {
    /** Returns a refusal for a `turn/start` line that must not run. */
    check(line: string): Refusal | null {
      let message: any;
      try {
        message = JSON.parse(line);
      } catch {
        return null;
      }
      if (message?.method !== "turn/start" || message.id === undefined) {
        return null;
      }
      const threadId: string = message.params?.threadId;
      const options = message.params?.options ?? {};
      const requested = MODE_OPTION_IDS.map(
        (id) => options.sessionOptions?.[id],
      ).find((value): value is string => typeof value === "string");
      const mode = requested ?? modeByThread.get(threadId) ?? DEFAULT_MODE;
      if (options.permissionMode !== "full" && UNGUARDED_MODES.has(mode)) {
        return {
          id: message.id,
          message: `Devin's "${mode}" mode runs commands without asking BB. Switch this thread to Full permission, or choose Devin's Code, Ask or Plan mode.`,
        };
      }
      modeByThread.set(threadId, mode);
      return null;
    },
  };
}
