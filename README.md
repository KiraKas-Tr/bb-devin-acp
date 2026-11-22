# bb-plugin-devin

Registers the local Devin CLI as a BB provider (`devin`). BB launches
`devin acp` and drives it with its generic ACP bridge; the plugin only
declares the provider (`server.ts`) and re-exports that bridge (`host.ts`).

## Install

```sh
devin auth login          # once per machine; `devin` must be on PATH
npm install
bb plugin install . --yes
```

After editing: `bb plugin build . && bb plugin reload devin`.

## Check

```sh
npm run typecheck
bb provider models devin  # Devin's models and the `mode` option
```

## Permission gate

Devin's `bypass` and `smart` modes run shell commands without asking BB.
`mode-gate.ts` refuses a turn in those modes unless the thread's BB
permission is `full` (`npm test` covers the rules).

## Known limits

- No reasoning picker, fork, or `/compact`: Devin's ACP server does not
  advertise them.
- BB identifies itself to every ACP agent as `bb`; this plugin does not
  change that.
