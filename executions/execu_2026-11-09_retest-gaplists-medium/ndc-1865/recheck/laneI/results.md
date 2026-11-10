# NDC-1865 recheck, Lane I (10 Nov 2026, NDC-Staging, ndc-staging-owner)

## B. Reply All "To" empty — STILL REPRODUCES (both cases)
Contact: existing "mahmoud mohamed" <mmohamed@anyware.software> (de7195a2, not ours, left as is). Department Tech (From Tech <tech@help-staging.anyware.software>).

| Case | 1st Reply All (before any reply) | After reply 1 sent, reload, Reply All again | Reply (not All) after reply 1 |
|---|---|---|---|
| 1. Ticket #2543 created in the New Ticket UI form | Recipients empty ("Add a recipient"), no Cc | Recipients empty; contact put in **Cc** | — |
| 2. Ticket #2504 created by API | Recipients empty, no Cc | Recipients empty; contact put in **Cc** | Recipients empty, no Cc |

- The ticket's Contact Info shows mmohamed@anyware.software in both cases, so the composer has the address but does not use it as To.
- Reply 1 was sent only after typing the address into Recipients by hand. Reply 2 was not sent (To empty).
- Reply menu: Reply All / Reply / Forward.
- A ticket that arrives by real inbound email could not be created from here; not checked.
- Evidence: evidence/raw/b1-ui-replyall-1-before.png, b1-ui-replyall-2-after-reply1.png, b2-api-replyall-1-before.png, b2-api-replyall-2-after-reply1.png, b2-api-reply-only-after-reply1.png, b2-api-reply-menu.png.

## G. Department created as public saved as private — NOT REPRODUCED in the UI
- In TAVI, public/private = "Display in Help Center" ("Public - customers can see this department in the Help Center"). It is on by default in the New Department form.
- UI create with it on → POST sends display_in_help_center:true → API reads visibility "public"; reopened form shows it checked. UI edit off → "private", on → "public". Works.
- API: the write field is display_in_help_center; `visibility` is read-only and silently ignored. POST with visibility:'public' → private; POST with no field → private (UI default is public); POST with display_in_help_center:true → public. Lane G's run sent visibility:'public', which explains its result. Minor API note only: unknown field ignored without error, API default differs from the UI default, and PATCH requires the full object (name) — 400 "Department name is required." for a partial PATCH.
- Evidence: evidence/raw/g2-form-before-save.png, g4-reopened.png, g5-edit-private-before-save.png, g5-edit-public-before-save.png, g6-reopened-after-edits.png.

## Emails sent (2, both to mmohamed@anyware.software from Tech)
- Reply 1 on #2504 "Re: QA RC 1865 API ticket"; reply 1 on #2543 "Re: QA RC 1865 UI ticket".
- Creating the 2 Tech tickets will also have fired the enabled Tech "ticket created" rules (agent/contact notifications); not avoidable without changing shared rules.

## Cleanup
2 tickets + 4 departments deleted, 6 Recycle Bin items purged, all return 404, bin clear. Contact de7195a2 untouched. Session file deleted. Nothing posted to Plane.
