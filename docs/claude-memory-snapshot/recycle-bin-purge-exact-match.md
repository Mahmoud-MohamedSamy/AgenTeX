---
name: recycle-bin-purge-exact-match
description: "Never purge Recycle Bin items by search result position; the TAVI bin search ignores q, so match record_id + record_label exactly"
metadata:
  node_type: memory
  type: feedback
  originSessionId: f8ef493a-ea8b-46bf-90e4-4def7dea2502
  modified: 2026-11-12T10:17:03.216Z
---

Before any "delete forever" on TAVI (`/audit/recycle-bin/delete`), pick the item by exact `record_id` and `record_label` of a record this run created; never take `items[0]` from a search. `/audit/recycle-bin/items?q=` ignores `q` and returns the newest items of everyone.

**Why:** 12 Nov 2026 the Wave 2 resume script took the first search result after its own ticket failed to create, and permanently purged someone else's bin item (almost surely QA data, unrecoverable). Reported to the user on the progress page.

**How to apply:** also guard with "only if my create succeeded"; applies to every destructive call that selects targets from a list ([[desk-go-live-retest]], [[one-owner-signin-per-run]]).
