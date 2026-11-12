---
name: workflow-rules-actions-count-ndc-2731
description: NDC-2731 (29 Oct 2026) — Workflow Rules list Actions column shows 1 for a rule with several condition branches
metadata:
  node_type: memory
  type: project
  originSessionId: e04d7870-dc74-4bc6-84cb-89da654b8d14
  modified: 2026-10-29T12:58:36.657Z
---

Jam https://jam.dev/c/f167b851-cb59-4f59-a409-62a5b82beba9 was filed on 29 Oct 2026 as NDC-2731. It is in state Bug with priority medium, in module CRM and cycle Sprint 13. Assignees are the same four as [[blueprint-revert-ndc-2730]].

The rule "MultipleConditions" (c11555bd-260e-49c1-b7da-b3ef0b7232ac) has at least 10 condition branches, each with its own Add Tags action, but the list shows Actions = 1. The rule's data keeps condition 1's actions at the top level and the other branches' actions separately, so the column seems to count only the top-level ones. The listing request wasn't captured, so this is inferred, not proven.

**Why:** a retest needs to know the count must cover all branches.
**How to apply:** on retest, check that the Actions column equals the sum of actions across all branches, including the else branch.
