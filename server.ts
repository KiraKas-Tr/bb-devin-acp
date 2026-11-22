// bb-plugin-devin — registers the local Devin CLI (`devin acp`) as a BB
// provider. BB's generic ACP bridge (re-exported from host.ts) does the
// protocol work; this file only declares the provider.
import type {
  BbPluginApi,
  PluginProviderDeclaration,
} from "@get-bb/plugin-sdk";

// Where Devin itself reads skills (`devin skills paths`), so BB lists them
// in the composer. `user` is relative to the home directory: `.config/...`
// on macOS/Linux, `AppData/Roaming/...` on Windows.
const nativeSkillRoots = {
  user: [
    { path: ".agents/skills" },
    { path: ".config/devin/skills" },
    { path: "AppData/Roaming/devin/skills" },
  ],
  project: [
    { path: ".agents/skills" },
    { path: ".devin/skills" },
    { path: ".windsurf/skills" },
  ],
};

export const devinProvider: PluginProviderDeclaration = {
  id: "devin",
  displayName: "Devin",
  family: "acp",
  icon: "./icons/devin.svg",
  // Listed only on hosts where `devin` is on PATH.
  experimental_visibility: "installed",
  strings: {
    signInHint: "Run `devin auth login` on the machine to sign in.",
    expiredHint:
      "Your Devin session expired. Run `devin auth login`, then reload.",
    installUrl: "https://docs.devin.ai/cli",
  },
  experimental_nativeSkillRoots: nativeSkillRoots,
  experimental_bridgeOptions: {
    acpDialect: "acp",
    acpLaunchSpec: {
      displayName: "Devin",
      command: "devin",
      args: ["acp"],
      env: {},
      nativeSkillRoots,
    },
  },
  // Devin's model list depends on the signed-in account, not the workspace.
  models: { scope: "host" },
  maintenance: { health: true },
  capabilities: {
    supportsServiceTier: false,
    supportsNativeUserQuestion: false,
    // Devin's ACP server advertises no session/fork or compaction.
    fork: "none",
    supportsManualCompaction: false,
    supportsThreadArchive: false,
    supportsThreadRename: false,
    // The bridge answers Devin's permission requests: it asks the user in
    // accept-edits and approves them all in full.
    permissionModes: ["accept-edits", "full"],
    // Fallback ladder only; BB hides the picker when Devin reports no levels.
    reasoningLevels: ["low", "medium", "high", "xhigh", "max"],
  },
  composerActions: [],
};

export default function devinPlugin(bb: BbPluginApi): void {
  const { dispose } = bb.providers.register(devinProvider);
  bb.onDispose(dispose);
}
