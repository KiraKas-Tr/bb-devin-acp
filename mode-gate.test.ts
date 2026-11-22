import assert from "node:assert/strict";
import { test } from "node:test";
import { createDevinModeGate } from "./mode-gate.ts";

let nextId = 1;
function turn(
  threadId: string,
  permissionMode: string,
  sessionOptions?: Record<string, string>,
): string {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: nextId++,
    method: "turn/start",
    params: { threadId, options: { permissionMode, sessionOptions } },
  });
}

test("refuses an unguarded Devin mode under accept-edits", () => {
  const gate = createDevinModeGate();
  assert.notEqual(gate.check(turn("t", "accept-edits", { mode: "bypass" })), null);
  assert.notEqual(gate.check(turn("t", "accept-edits", { mode: "smart" })), null);
});

test("allows Devin's prompting modes under accept-edits and any mode under full", () => {
  const gate = createDevinModeGate();
  assert.equal(gate.check(turn("t", "accept-edits", { mode: "plan" })), null);
  assert.equal(gate.check(turn("t", "full", { mode: "bypass" })), null);
});

test("remembers bypass chosen under full when the thread drops to accept-edits", () => {
  const gate = createDevinModeGate();
  assert.equal(gate.check(turn("t", "full", { mode: "bypass" })), null);
  assert.notEqual(gate.check(turn("t", "accept-edits")), null);
  assert.equal(gate.check(turn("t", "accept-edits", { mode: "accept-edits" })), null);
  assert.equal(gate.check(turn("t", "accept-edits")), null);
});
