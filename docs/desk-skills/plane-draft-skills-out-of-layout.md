# Plane draft — Take Skills out of the Tickets layout (match Zoho Desk)

**Project:** NDC · **Type:** Improvement / Bug (parity) · **Module:** Desk · **Label:** Assignment Rules
**Priority (suggested):** Medium · **Relates to:** NDC-2752 (Desk Skills), NDC-2827 (ticket Skills tab), NDC-2821 (skill types per department), NDC-2275 (Assignment Rules)
**Status:** DRAFT — not filed

---

## Title
Desk Tickets: remove "Skills" from the module layout — manage ticket skills only from Settings → Skills and the ticket's Skills tab (like Zoho Desk)

## Summary
In TAVI Desk, **Skills** is a normal field in the Tickets layout. It shows on the New Ticket / Edit Ticket form and in the layout editor like any other field. In Zoho Desk, skills are **not a layout field**. They are set up only on the **Skills** page in Setup (Zoho help: **Setup → Customization → Skills**), and reach a ticket in three ways: automatically by skill criteria, manually from the **Skills** panel on the ticket page ("Associate Skills"), or by a workflow **Add Skills** action. Zoho's list of standard ticket fields (17 fields) has no Skills field.

Having Skills in two places (layout field + Skills tab) is confusing and lets users pick skills that do not follow the Skills rules (department, active state, skill type).

## Current behaviour (TAVI, NDC-Staging)
- Tickets → Standard layout → section **Ticket Information** has field **Skills** (`skills`, type multi-select, order 5).
- The field is a plain multi-select: not a system field, can be deleted, can be dragged to other sections, can be made required.
- It shows on the New Ticket and Edit Ticket forms, so agents can set skills by hand there.
- The ticket page also has the **Skills** tab in the side rail (added under NDC-2827) with **Associate Skills**, which checks the ticket's department and active skills.
- So the same data can be changed from two places with different rules.

## Expected behaviour (Zoho Desk)
1. **No Skills field in the layout.** Skills does not appear in the Tickets layout editor field list, on New Ticket, Edit Ticket, or the customer portal / web form.
2. **Settings stay the place to manage skills.** The Setup **Skills** page keeps: skill list per department, skill types, criteria, auto-add preferences, Active/Inactive.
3. **Ticket page Skills tab stays the place to set skills on one ticket.** Associate / remove skills from the ticket's Skills tab, only skills of the ticket's department that are active.
4. **Automatic paths keep working:** skill criteria on create/update, workflow actions (Add/Remove/Recalculate Ticket Skills, Reassign by Skills), "Assign by Skills" in the ticket ⋯ menu.
5. Skills stay **visible** on the ticket Skills tab. Whether Zoho also offers Skills as a ticket list-view filter is **to confirm** in the live Zoho org.
6. **The ticket API still takes skills.** Zoho tickets carry an `entitySkills` list of skill IDs (max 10); the order sets priority (first = highest) for skill-based assignment.

## Requested change
- Remove the `skills` field from all Tickets layouts (Standard and custom), and stop it from being added back from the field list.
- Keep the stored ticket skills data; only the layout field is removed. Existing tickets keep their skills and show them in the Skills tab.
- Hide Skills from New Ticket, Edit Ticket, quick create, web forms and the help-center ticket form.
- Keep skills in the ticket API (like Zoho `entitySkills`): up to 10 skill IDs, kept **in order** (first = highest priority), with the same rules as the Skills tab (department, active). The current multi-select field keeps no order — this is a gap to close with the change.
- Check other places that read layout fields: list view columns/filters, import field mapping, export, blueprint "Field update", workflow "Field update", validation rules, layout rules. Skills should not be offered there as a normal editable field; the skills workflow actions remain.

## Acceptance criteria
- [ ] Tickets layout editor (Standard + any custom layout): no Skills field in sections or in the available fields list.
- [ ] New Ticket / Edit Ticket / quick create forms: no Skills input.
- [ ] Web form builder and help-center form: Skills not offered.
- [ ] Settings → Assignment Rules → Skills: unchanged, all functions still work.
- [ ] Ticket page → Skills tab: Associate Skills / remove work; only active skills of the ticket's department are offered.
- [ ] A ticket that had skills set through the old layout field still shows those skills in the Skills tab after the change.
- [ ] (To confirm vs Zoho) Ticket list view filter by Skills.
- [ ] Skill criteria, workflow skill actions and "Assign by Skills" still add skills and assign by them.
- [ ] Workflow / blueprint "Field update" and layout rules do not list Skills as a normal field.
- [ ] Import mapping does not offer Skills as a plain field (Zoho import behaviour for skills **to confirm**).
- [ ] Ticket API accepts and returns up to 10 skills per ticket, in order; an 11th is refused.

## Steps to see the current state
1. Sign in to TAVI Desk (NDC-Staging) as owner.
2. Setup → Customization → Modules → Tickets → Layouts → Standard.
3. Section **Ticket Information**: field **Skills** is listed (multi-select) and can be moved, made required, or deleted.
4. Open **New Ticket**: the Skills field is on the form.
5. Open any ticket → side rail **Skills** tab: Associate Skills is also there.

## Reference
- Zoho Desk help — Standard Modules and Fields (no Skills in the 17 ticket fields): https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/standard-modules-and-fields-zoho-desk
- Zoho Desk help — Assigning Tickets using Workflow and Assignment Rules (Setup → Customization → Skills; auto-add preference; manual or workflow): https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule
- Zoho Desk help — FAQs: Workflow Rules (Add Skills action): https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-rules
- Zoho Desk API — Tickets (`entitySkills`, max 10, ordered): https://desk.zoho.com/DeskAPIDocument#Tickets
- Zoho ticket Skills panel ("Associate Skills") — checked when NDC-2827 was filed, 9 Nov 2026.
- TAVI evidence: Standard layout config (`skills`, `multi_select`, `isSystemField:false`, `isDeletable:true`) — `executions/execu_2026-11-10_retest-mahmoudmohamed-r15/out/2815-standard-layout-backup.json`.

## Images (to add before filing)
1. TAVI layout editor with the Skills field highlighted vs Zoho layout editor (no Skills field).
2. TAVI New Ticket form with Skills vs Zoho New Ticket form.
3. TAVI ticket Skills tab vs Zoho ticket Skills section (to show what stays).
