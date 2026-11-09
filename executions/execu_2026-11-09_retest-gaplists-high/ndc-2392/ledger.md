# Lane B ledger — 9 Nov 2026
- STOPPED on coordinator order (user: one tenant only, NDC-Staging). No further calls.
- Sign-in: 1 × mahmoud.mahamed1515 (creds index 8) → own state file scratchpad/laneb-desk.json. Token tenant_id a7a7a7a7-0000-0000-0000-000000000004 (automation feature-map says Anyware = …0002, so which tenant this is should be confirmed).
- Calls made: GET only (iam/me, integration status/config/products, settings/resolved, roles/hierarchy/sharing-rules/data-sharing, me/subordinates, CRM /modules, locale JSON fetch stopped mid-way). No POST/PUT/PATCH/DELETE.
- Writes: none. Cleanup: nothing to clean up.
- 9 Nov: Anyware/index-8 cleanup check: no records were created, nothing to delete or purge. laneb-desk.json no longer used.
- 9 Nov: signed in ndc-staging-owner (creds index 7) once → ndc-2392/state-desk.json
- 2026-11-09T15:27:30.349Z CRM lead created 69d2ca6a-5702-4d6f-978f-a99f86f462de (QA RT 2392 Lead mw9f0ar2, qa.rt2392.lead.mw9f0ar2@example.com)
- 2026-11-09T15:27:30.825Z Desk contact created dc8403e7-39b8-4057-979f-32483beb6ffb (QA RT 2392 Contact mw9f0ar2)
- 2026-11-09T15:28:16.225Z CRM contact created by sync faa1c662-6f09-49b8-90a4-a5b9bb6ccf68 (twin of dc8403e7-39b8-4057-979f-32483beb6ffb)
- 2026-11-09T15:28:43.507Z DELETE crmContact faa1c662-6f09-49b8-90a4-a5b9bb6ccf68 → 204
- 2026-11-09T15:28:43.866Z DELETE lead 69d2ca6a-5702-4d6f-978f-a99f86f462de → 204
- 2026-11-09T15:28:59.422Z DELETE deskContact dc8403e7-39b8-4057-979f-32483beb6ffb → 204
- 2026-11-09T15:29:08.808Z purge desk bin ids e1831256-a52c-43bd-bc5c-7a73341420f3,d43b1d3a-5e34-4193-96c6-71ae9a84790b,9614b2c3-747e-4be6-b648-f188f2a85784 → 200
- 2026-11-09T15:29:10.311Z verify {"lead":404,"crmContact":404,"desk":404} binLeft {"desk":0,"crm":0}
- 9 Nov: all other checks read-only (GET + UI with every non-GET /api/v1 call aborted except auth refresh/realtime/search). Handshake view switched in the browser and back to Classic in the same session (no save request).
- 9 Nov: results.md, plane-draft.html (+ plane-draft-comment.html), evidence/annotated ev-A..ev-D built. NOT posted.
- Cleanup status: complete (lead, Desk contact, sync-created CRM contact deleted by id; recycle bin purged by id; verify 404 ×3, bin 0).

## 9 Nov cleanup (main session)
- Posted: NDC-2392 comment 96366380-2156-4389-9e83-a0466de94d55 + 4 images (ev-A..D); NDC-2417 comment 5d6e6454-7965-430a-aab7-3ac7f89196ef + 3 images (ev-01..03).
- Verified: Desk contact dc8403e7 404; Recycle Bin has no QA RT items or the 3 ids.
- Removed: all session files in the scratchpad (admin, laneA, laneB x2, main-ndc); downloaded bundles/ and locales/ (app JS/JSON, 14 MB).
