// The plugin's `bb.host` entry: BB's generic ACP bridge launches and drives
// `devin acp` on the host using the launch spec declared in server.ts. The
// mode gate runs first and refuses turns that would let Devin skip BB's
// permission prompts (see mode-gate.ts).
import {
  BRIDGE_JSON_RPC_ERRORS,
  createBridgeIo,
  experimental_defineProviderBridge,
} from "@get-bb/plugin-sdk/provider-bridge";
import { experimental_acpProviderBridge as acpBridge } from "@get-bb/plugin-sdk/provider-bridge/acp";
import { createDevinModeGate } from "./mode-gate";

const io = createBridgeIo();
const gate = createDevinModeGate();

export const experimental_providerBridge = experimental_defineProviderBridge({
  handleLine(line) {
    const refusal = gate.check(line);
    if (refusal) {
      io.sendError(
        refusal.id,
        BRIDGE_JSON_RPC_ERRORS.INVALID_PARAMS,
        refusal.message,
      );
      return;
    }
    acpBridge.handleLine(line);
  },
  start: (context) => acpBridge.start?.(context),
  onClose: () => acpBridge.onClose?.(),
  onSigterm: () => acpBridge.onSigterm?.(),
  onSigint: () => acpBridge.onSigint?.(),
});
