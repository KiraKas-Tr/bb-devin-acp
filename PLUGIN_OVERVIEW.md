Run BB threads with Devin, using the Devin CLI already installed on your machine.

## What you get

- A **Devin** provider in the thread composer.
- Devin's session modes (Code, Smart, Ask, Plan, Bypass) as the `mode` option.
- BB's `accept-edits` and `full` permission modes: in `accept-edits` BB asks
  you before Devin's actions, in `full` it approves them.
- Skills from Devin's own skill folders listed beside BB's.

## Requirements

- The Devin CLI on the host's `PATH` as `devin`
  (https://docs.devin.ai/cli).
- Sign in once on that machine: `devin auth login`.

The plugin stores no credentials; the Devin CLI owns sign-in.
