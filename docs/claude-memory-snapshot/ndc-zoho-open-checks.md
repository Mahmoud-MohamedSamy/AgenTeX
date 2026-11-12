---
name: ndc-zoho-open-checks
description: "M-17, A-9, A-3 behaviours seen only as NDC Zoho settings, not live — user said keep in mind, return later (4 Nov 2026)"
metadata:
  node_type: memory
  type: project
  originSessionId: 26a0d551-16a6-421d-90b5-d1ea695c4641
  modified: 2026-11-04T08:27:29.699Z
---

User (4 Nov 2026): "keep M-17, A-9, and A-3 in your mind, we will return to it later."
These three were captured from NDC's Zoho as configuration only; the runtime behaviour was never observed:
- M-17 (NDC-2796): changing the layout on an existing ticket in Zoho, and what happens to its fields/values.
- A-9 (NDC-2797): what Zoho does with a ticket's status when its layout/department changes ("fall-back to default" per status).
- A-3 (NDC-2793): a "Create + Field Update" rule actually firing (seen as a setting only).

**Why:** retests of those tickets may need the real Zoho behaviour as the expected result.
**How to apply:** when the user returns to these, a short read-only NDC Zoho visit (push approval via user, see [[ndc-zoho-usage-gap]]) can settle them; do not explore NDC Zoho otherwise unless asked.
