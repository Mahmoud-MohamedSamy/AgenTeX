---
name: retest-means-full-feature
description: "For go-live / feature retests, test every function of the feature, not just the open tickets"
metadata:
  node_type: memory
  type: feedback
  originSessionId: ca52bc4d-0db1-426b-bafd-203234d3e32c
  modified: 2026-10-25T14:18:53.257Z
---

When the user asks to "retest every feature" (go-live waves), the test list must cover every function of each screen
(every button, field, message, permission and API), plus the open bugs — not a list built around old tickets.

**Why:** on 25 Oct 2026 the first Wave 1 list was ticket-driven; the user stopped it ("are you retesting the old bugs or
the whole feature?") and chose "Full feature retest" for this and all later waves.

**How to apply:** build each wave's case list from the screen's locale file (every action/field) + live API + the Zoho
inventory, map the open tickets onto those cases, and say clearly which cases were not run. Related: [[crm-go-live-feature-inventory]].
