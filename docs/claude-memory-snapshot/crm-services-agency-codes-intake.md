---
name: crm-services-agency-codes-intake
description: "NDC Zoho CRM Services + Agency Codes modules study (22 Oct 2026) — explanation doc for devs + test spec for TAVI CRM; waiting on user's Jam video"
metadata:
  node_type: memory
  type: project
  originSessionId: 25d017f1-66c1-4f43-92b7-c4a82ab31398
  modified: 2026-10-22T12:47:48.547Z
---

- Started 22 Oct 2026 via /new-feature-testing. App: CRM. Output asked: dev explanation doc (business + logic) + test spec. No gap ticket asked.
- Only Plane trace: NDC-1484 "Modules" (Agency Code + My Jobs missing vs Zoho, "needs more explanation"). No PRD. NDC-944 shows the chatbot looks bookings up by PNR.
- User has no access to NDC org's Modules & Fields setup; will send a Jam video of the Services/Agency Codes create forms. I asked for: list views, picklists, lookup targets, related lists, the all-modules list (is there a PNR module?), and a no-save duplicate test.
- User's belief (to verify): Account 1:1 Agency Code; Agency Code 1:N Services; PNR → one Service.
- Zoho research (scratchpad crm/services-agency1022/zoho-inventory.md): Zoho has no native 1:1 and lookups cannot be unique. 1:1 must come from a unique text field, a validation function or a lookup filter. Zoho also has a built-in "Services" module (Appointments); check which one NDC uses.

**Why:** devs build from this, so every claim must be checked against the video or docs.
**How to apply:** don't write the doc until the Jam is analysed (skill jam-records) and the open questions are answered.

22 Oct (later): Zoho KB checked → built-in Services__s = appointment-centric (Duration 15–1440 min, Members, Location, Availability, Price mandatory; 500 active max; Professional+; auto-adds Appointments; can be a lookup target from custom modules). Zoho test org org943261092 = Enterprise TRIAL until 2 Nov 2026, Services NOT enabled (asked user before enabling). TAVI CRM bundle: custom modules (Create New Module, org/department storage), lookup + multi_select_lookup (canSetUnique false, like Zoho), unique on single_line/email/number/long_integer/auto_number, validation + layout rules, field permissions. Scripted API sign-in to staging-crm was blocked by the auto-mode classifier (credential read) → bundle/locales only. Scratch: crm/services-agency1022/{zoho,bundle,locales}.

22 Oct (Jam 5dc70123 analysed; user said DON'T post anything on the Jam/Plane): NDC org745682607. Accounts is renamed "Agency Code"; Deals → "Transactions" (lookup "Agency Code…" → Accounts, plus a "Flight Details" section that wasn't shown); Contacts → "Customers"; CustomModule1 "Agency" (Agency Code + Agency Name + Email UNIQUE, registration/licence/contract files, "Agency Registration" workflow on create); CustomModule3 "Services." = per-customer visa/insurance request (agency name/code are TEXT, not lookups; cost/price fields; Approval Stages). No PNR module. Notes: scratchpad crm/services-agency1022/jam/ndc-zoho-model-v1.md.
