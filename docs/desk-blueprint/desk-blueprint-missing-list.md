# Blueprint (with SLA tie-in) — what Zoho Desk has that TAVI Desk is missing

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com`, org **Anyware** (owner account), bundle `index-Dhp544pg.js` |
| Reference | Zoho Desk live, **Enterprise trial**, org `techsolutionsegypt`, read only (screens in `reference/screens/zoho-*.png`: Create Blueprint settings, Blueprint views, dashboard list, Blueprint Dashboard, profile "Revoke Blueprint"), plus Zoho's help pages, API reference and edition page (`reference/zoho-docs-inventory.md`) |
| HTML report | [`desk-blueprint-missing-list.html`](desk-blueprint-missing-list.html) — TAVI vs Zoho side by side |
| Scope | Setup → Automation → Blueprints (list, designer, states, transitions, state time limits), tickets inside a blueprint, and how blueprint timers sit next to the department SLA |
| PRD | **NDC-1974** "Blueprints (guided ticket process)": two lines only ("A fixed sequence of steps… Verify → Approve → Pay. Phase 4. Needs first: SLA policies, workflow triggers."). It has no requirements list, so no item below can be mapped to a PRD phase |
| Already in Plane | **NDC-2266** SLA and Escalation gaps (roles / contacts as escalation recipients, email template per level, countdown view). These are not repeated here. CRM blueprint bugs on the same engine: NDC-2540, NDC-2420, NDC-2729, NDC-2730, NDC-2707, NDC-2334 |
| Test spec | [`spec-desk-blueprint.md`](spec-desk-blueprint.md) (Group Z rows Z1–Z15 = items 1–15) |
| Status | **Draft for review. Nothing filed in Plane, nothing changed on the tenant** |

How TAVI Desk was checked:
- From the build's code and strings, the live API (GET only) and the pages, signed in as the owner.
- Two blueprints were opened in the designer. One state and one transition were selected, and their panels were closed without saving.
- Two tickets inside a blueprint were opened. No transition was run.

Reference files in `reference/`:
- `tavi-build-map.md`
- `zoho-docs-inventory.md`
- `tavi-baseline-2026-11-01.json`: the 4 blueprints, ticket statuses, departments, SLA policies, business hours, and the tickets inside blueprints. Used later to prove nothing changed.
- `screens/`: designer, state panel, transition panel, ticket Steps card, ticket list.

---

## Already done in TAVI Desk

- Blueprints page, grouped by department:
  - Each row shows its layout, state count, Draft badge and how many tickets are in progress.
  - Row actions: activate / deactivate, include tickets, revoke tickets, delete (refused while tickets are inside).
  - Drag to set the order. A ticket enters the first blueprint that matches.
- One blueprint belongs to one department and one layout (or any layout).
- Entry criteria, or all tickets.
- States are ticket Status values. Add State creates a new status (Open / On Hold / Closed type).
- Canvas with up to 16 connections per state, the same limit as Zoho.
- Common transitions (from any state).
- Continuous blueprint: a step whose only transition asks for nothing runs on its own.
- Save Draft, Save and Publish, and a list of problems to fix before publishing.
- Before:
  - Owners can be agents, teams, the ticket owner, or another department with Full / Read only / Restricted access. The ticket is shared with that department while it is in the state.
  - No owner means any agent in the department.
  - Criteria decide when the button shows.
- During: reply to the contact, internal comment, attachment, resolution, required fields, checklist, message. Each item is required or optional, in the order you set.
- After: field update (also contact fields), notification, create task, webhook, send email (Desk template; contact, owner, users, teams, roles), run custom action.
- Time limit per state:
  - Business hours or calendar time.
  - A warning before the limit.
  - Actions when the limit runs out.
  - Optionally move the ticket on its own when the limit passes.
- A transition can run on its own when the customer replies or rates.
- Ticket page:
  - Blueprint and state pill and a progress bar.
  - Steps card with time in state, due / overdue, warning time and next-step buttons.
  - The transition form shows required items.
  - Status is locked while the ticket is in a blueprint.
  - A reply does not close the ticket.
- Revoke one ticket, a list of tickets from the ticket list, or every ticket in a blueprint.
- Ticket history shows: entered, completed, left, revoked, transition run (with who ran it), moved by a reply / rating / timer, share skipped.
- Desk also has things Zoho does not have:
  - Include existing tickets in a blueprint at a state you choose.
  - Version history with restore.
  - Parallel steps and branches.
  - Webhook, notification and custom action as after-actions.
  - Actions at the warning time.
  - Moving a ticket automatically when the time limit passes.

---

## Missing — blueprint settings

1. **Strict Mode:** agents can act on the ticket and edit fields only through transitions. Three choices: lock all actions, lock only selected actions, or lock all except selected. Today only Status is locked (and a reply cannot close the ticket). Zoho: Enterprise.
2. **Change transition owners from inside a ticket** (Zoho "Dynamic Transition Owner Assignment"). An admin or owner picks who runs the next transition, also from another department. Today the owners are fixed in the blueprint.
3. **Order of the transition buttons for each state.** The admin drags them into the order agents see. No order setting was found in the designer.

## Missing — during a transition

4. **Field check with your own error message:** for example "Refund amount must be more than 0". Today a field can only be required. The CRM designer has this ("validations"), but Desk turns it off, and `fieldValidations` is always empty in the API.
5. **Submit for approval** as a step inside the transition.
6. **Share the ticket with another department** as a step the agent fills in. Today sharing happens only automatically, when an owner is in another department.
7. **Widgets** (extensions) inside the transition form.
8. **Save a half-done transition as a draft** and finish it later. Today closing the form loses what was typed ("The reply and notes were not saved. Leave without saving them?").
9. **Different required items for different agent groups** (Zoho "Configure Mandatory").

## Missing — automatic transitions

10. **Run on certain ratings or replies only:** run on a Good, Okay or Bad rating only, or on a public or private reply only. Today "When the customer rates, run" and "When the customer replies, run" fire on any rating or reply.

## Missing — state time limits (SLA tie-in)

11. **Several escalation levels per state,** each at its own time before or after the due time, each with its own people and email. Today a state has one warning and one set of actions when the limit runs out.
12. **Choose which business-hours set (and holiday list) a state counts in.** Today the only choice is "Business hours" or "Calendar time", while Desk can have several business-hours sets (the SLA policies use them).

## Missing — where agents see results

13. **Blueprint views in the ticket list:** Active Blueprint Tickets, All Transitions, My Transitions, My Team Transitions, Unassigned Transitions. Today there are none, and the ticket list has no blueprint or state column or filter.
14. **Blueprint dashboard:**
    - Active and completed tickets.
    - Tickets and states over their time limit.
    - Met vs missed in %.
    - Average time per blueprint and per state.
    - How often each transition runs.
    - Filters by blueprint, period and agent.

    Today there is no blueprint report. `/modules/{tickets}/blueprints/reports`, `…/{id}/stats`, `/desk/blueprints/dashboard` and `/desk/blueprints/reports` return 404. Zoho: Enterprise.

## Missing — permissions

15. **A separate "Revoke blueprint" permission** in the profile. Today one permission, `desk:blueprints:manage`, covers designing, including and revoking.

---

## Could not be checked

- The tenant's only business-hours set is 24×7, and both holiday lists are empty. "Business hours" and "Calendar time" therefore give the same due times, and holidays cannot be seen. Please add a QA business-hours set (for example Sun–Thu 09:00–17:00 with one holiday), or allow us to add one, so we can test state time limits, warnings and auto-moves in business hours.
- Whether a state on an On Hold-type status pauses the department SLA, and whether the state's own timer pauses too. It needs transitions to be run on QA tickets. Please approve the functional run (spec groups H–J) so we can test it.
- Transitions on instant-messaging tickets (Zoho opens the IM reply box inside the transition). We could not see an IM channel. Please tell us if WhatsApp or Telegram is connected to a department, so we can test a transition with a required reply on an IM ticket.
- Zoho side of gap 12: the trial has no business-hours set, so Zoho's state clock list shows only "Calendar Hours" (sets are listed there when they exist).

## Additional notes

- Not gaps:
  - Clone a blueprint (Zoho has none).
  - Roles or profiles as transition owners (Zoho has none).
  - Changing department as a transition action (Zoho has none).
  - Webhook and notification after-actions (Desk extra).
  - Zoho edition limits (Desk has no edition caps).
- Not repeated (already in NDC-2266): escalation to roles and contacts, an email template per escalation level, the countdown view.
- Same engine as CRM: NDC-2540 (webhook after-actions and SLA escalation webhooks never sent), NDC-2420 (workflow rules not run after transitions with required fields) and NDC-2730 (a workflow changes the locked field and moves the record back). The spec re-checks each of them on Desk.
- Possible bug to check separately: the "On Hold" state of "Demo · Refund approval" closes tickets on its own after 3 days (`autoTransitionAfterMinutes: 4320`, the canvas shows "3d"). The state panel shows "No limit" and hides the auto-close, so saving the state may drop it.
- Possible bug to check separately: the time-limit example always says "Counted on a Monday to Friday, 9 to 5 week", although this tenant's business hours are 24×7.
- Possible bug to check separately: the status "Reopened" has the type Closed. A blueprint state "Reopened" may therefore end the blueprint or count as resolved.
- Possible bug to check separately: ticket #805 is inside a blueprint and still shows the "Close ticket" button.
- The PRD NDC-1974 has two lines and no requirements. Please add acceptance criteria so the gaps can be given phases.
- Test spec: `docs/desk-blueprint/spec-desk-blueprint.md` in the QA repository.
- Nothing was changed on the TAVI tenant.
- Zoho trial changes (user approved, 1 Nov 2026): a throwaway blueprint ("QA BP throwaway delete") was built for gaps 3–12 screens and discarded unsaved. For gap 8 a blueprint "QA BP gap8 delete" was saved and activated and ticket #101 "QA BP gap8 ticket delete" (contact Lawrence) was created and a transition draft saved; then the ticket and the blueprint were deleted. Zoho's blueprint list shows only "Default Blueprint" again. Ticket #101 remains in Zoho's Recycle Bin (permanent delete was blocked by a tool safety check; Zoho erases it after 60 days).

## Environment

staging-desk.taviportal.com, org Anyware, Edge, 1 November 2026, owner account.
