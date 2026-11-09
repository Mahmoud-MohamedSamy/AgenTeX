# Wave 1 — open cases rerun on NDC-Staging (2 Nov 2026)

Tenant NDC-Staging ("Wonder Travel"), owner ndc-staging-owner account, agent fedelav803 (Desk Agent, Customer Support), supervisor pacox68754 (Desk Supervisor, Tech). Raw output `ndc/raw/*.json`, screenshots `evidence/raw/ndc/` and `evidence/raw/bugs/`. Anyware-Staging was not touched.

| Id | Verdict | Note |
|---|---|---|
| W1-12 | PASS | DELETE default business hours → 409 BUSINESS_HOURS_DEFAULT_UNDELETABLE "The default business hours profile cannot be deleted. Make another profile the default first." Default kept. |
| W1-20 | PASS | Department list shows a DEFAULT badge on Customer Support; columns Name / Type / Created / Status. Zoho's list also shows Help Center display name, Created by and Created time (TAVI has no such columns — minor). |
| W1-22 | PASS | Ticking "Display in Help Center" on the form and Save → visibility public (GET); unticking → private. The earlier inconclusive result was an automation problem. |
| W1-29 | PASS | Invite mahmoud.mmohamedsamy+qagln@gmail.com as Desk Agent → created, 7-day invitation (audit "created"). |
| W1-30 | PASS (with note) | Re-inviting the same pending address reuses the invitation (no second user). Note: inviting mmohamed@anyware.software, who is already an ACTIVE user with the CRM Admin profile but no Desk profile, is accepted and adds a pending Desk invitation row next to the active user (Agents page shows "Invited · Desk Agent"). Possible bug to check: one email with an active row and a pending row. Invitation cancelled. |
| W1-32 | PASS | Resend → audit "invitation_resent"; cancel → audit "invitation_cancelled"; the invitation is gone. |
| W1-33 | PASS | Desk Agent: create department, read profiles, invite, create business hours, holiday list, team, branding → 403 each. Notes: business hours returns validation errors (400) before the permission check when the body is incomplete; the agent can open the Agents list and the Company page (its profile has iam.user.view and company profile view). |
| W1-36 | PASS | Role "QA GL N Role" with the agent in it → DELETE refused 409 org_unit_not_empty "Org unit still has users". Agent moved back, role deleted. Note: role calls need `?app_key=desk`; without it the API returns 204 but does not move the user. |
| W1-41 | PASS | Rename built-in "Desk Agent" → 409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be renamed. Clone the profile to create one you can rename." Name unchanged. |
| W1-51 | PASS | "QA GL N status" (open) added → listed in ticket statuses and the Status field; adding it again as Closed → 409 STATUS_EXISTS; removed again (statuses back to Open, On Hold, Escalated, Closed). |
| W1-58 | PASS | Signature for all departments created, edited, deleted (API, read back each time). The My signatures page was still on "Loading your signatures…" after 25 s (slow, not checked further). |
| W1-52 | PASS — NDC-2303 fixed | Ticket in Customer Support shared with Tech. Tech-only Desk Supervisor PATCH priority: Read only → 403, Restricted → 403 (priority stays High); Full → 200 (allowed, as designed). Banners correct for each level. |
| W1-53 | PASS — NDC-2387 fixed | Required field on a QA module: hidden → 422 FIELD_REQUIRED_HIDDEN_CONFLICT; read_only → 422 FIELD_REQUIRED_READONLY_PERMISSION_CONFLICT with a clear message. |
| W1-B1 | FAIL (reproduced on NDC) | Screen: 300-digit phone → toast "An unexpected error occurred." (500); 40-digit phone saved. Website "not a url" is refused on screen ("Enter a valid website URL", Save disabled) but saved by the API. Zoho: phone field max 20 characters, website max 50 and no format check (saved "http://not a url"). Values restored on both sides. |
| W1-B2 | FAIL (reproduced on NDC, on screen) | Two tabs on QA GL N Dept: tab A CC off + Save; stale tab B saves a Help Center name; reload shows CC back ON. Zoho: not checked — the department edit form does not save in the Zoho trial org ("Unable to process your request"); nothing changed in Zoho. |
| W1-04 audit | Observation | The audit entry for the company save lists time_zone "null → UTC" while the stored time zone stayed Africa/Cairo. The agent's Company page also shows "Time zone UTC". Possible bug to check separately. |

## Close-out (2 Nov 2026)
- W1-30 note filed as **NDC-2778**; W1-04 audit note filed as **NDC-2779**; W1-B1 = **NDC-2776**; W1-B2 = **NDC-2777**.
- W1-52 / W1-53: **NDC-2303** and **NDC-2387** moved to Done (comment + annotated image).
- Extra evidence runs: invite to mmohamed@anyware.software repeated once and cancelled (`raw/n-f1.json`); company time zone read UTC/v0 once then Africa/Cairo/v1 on the same unchanged record (`raw/n-f2.json`, `n-f3`, `n-f4`); QA module "QA GL N FP" created/deleted for NDC-2387 (`raw/n-f10.json`).
