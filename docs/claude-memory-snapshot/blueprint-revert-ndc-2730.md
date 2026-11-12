---
name: blueprint-revert-ndc-2730
description: "Jam 1af24d22 (29 Oct 2026) blueprint stage revert by workflow AEX-01 — filed as NDC-2730, urgent, Bug, CRM + Sprint 13"
metadata:
  node_type: memory
  type: project
  originSessionId: e04d7870-dc74-4bc6-84cb-89da654b8d14
  modified: 2026-10-29T11:35:24.392Z
---

Jam https://jam.dev/c/1af24d22-aed9-4582-9f6a-031196864e2f (author noles40331) was analysed on 29 Oct 2026 and filed as one Plane ticket, NDC-2730. The ticket is in state Bug with priority urgent, in module CRM and cycle Sprint 13. Assignees are MahmoudMohamed, Hegazy, madly and eahmed.

The ticket covers three findings:
1. Workflow rule AEX-01 (d28207a9-c47b-41cd-8d06-9547904814d7) runs again after each blueprint transition and sets lead_source back to `chat`, so the blueprint stage reverts 2–4 seconds later. Each run also creates another workflow task.
2. The page doesn't re-request `/blueprint-state` after an approval decision, so the blueprint only shows after an edit. Not proven server-side, because the user didn't reload between approving and editing.
3. ChatToOther shows "Invalid Phone Number" for 01099130163 although the rule is startsWith 010 (looks inverted).

Updated 29 Oct: locked-field rule stated; approval part = needs page refresh (not edit); AEX-01 trigger is RecordCreated yet re-ran on transitions (read 11:45, may have changed after first Jam). Double-check Jam e4de22a2 linked as "Attachment 2"; it showed no revert but stopped ~2s after the last transition. Jam comments denied by the permission check, not posted.

**Why:** retests of NDC-2730 should check all three findings.
**How to apply:** when NDC-2730 reaches Ready For Test, retest the revert, the refresh after approval and the phone validation. See [[retest-ready-tickets-skill]].
