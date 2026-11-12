# Plan — Desk Skills full parity run (TAVI vs Zoho Desk), 12 Nov 2026

Goal: answer "is TAVI Desk Skills identical to Zoho Desk Skills?" with runtime evidence on both sides, function by function.

## Environments
- TAVI: NDC-Staging only, owner signs in ONCE (one saved session), plus 1 agent account for agent-side checks. Prefix `QA SK12`, every object in `ledger.md`, delete by ledger id only.
- Zoho Desk: test account techsolutionsegypt (saved session state). Read only unless the user allows QA writes (decision 1). Never click header switches.

## Step 1 — Build the function inventory (both sides)
Source: Zoho Desk help + API docs for Skills, live Zoho Setup → Skills screens, TAVI Skills tab locale strings + `/desk/skills*` API + ticket page Skills tab + workflow skill actions. One row per function: screen, button, field, message, permission, API, limit.

## Step 2 — Test cases (every function, not only old tickets)
| Group | Area |
|---|---|
| SK-A | Skills list: per department, columns, search, filters (Name/Type/Agents/Status), reorder, empty state |
| SK-B | Add / edit skill: name rules (blank, duplicate, 100+ chars, HTML), required type, inline new type, description, criteria (all operators), agents |
| SK-C | Skill types: per department (NDC-2821), add / rename / delete (in-use refused), limits |
| SK-D | Active / Inactive, delete dialog, "where used" (rules, agents, open tickets, workflow, approvals — NDC-2805) |
| SK-E | Preferences: auto-add on/off, placement (order of list / other), Clear |
| SK-F | Agent side: Agent → Skills tab ↔ skill form agents, same data both ways |
| SK-G | Ticket runtime: criteria on create / update, ticket Skills tab Associate / remove (NDC-2827), dept change, inactive skill never added, 10-per-ticket limit, skill order |
| SK-H | Assignment by skills: skill-based RR, no-skill tickets (10 Nov finding: go outside pool), Assign by Skills menu, thresholds (NDC-2824), same-event criteria + RR |
| SK-I | Workflow actions: Add / Remove (1–25) / Recalculate / Reassign by Skills |
| SK-J | Layout / fields: Skills field in layout + forms (11 Nov draft), list view filter, import, export, Field update actions |
| SK-K | Permissions (Desk Agent vs admin), API (GET/PUT/DELETE, 405s, validation), Arabic / RTL, phone width |

Each case: TAVI result + Zoho result seen live → Same / Differs / Gap / TAVI extra / Not comparable. TAVI extras are noted, not filed.

## Step 3 — Report
- Parity matrix (all rows) + verdict "identical: yes / no" with the list of differences.
- Screenshots only for FAIL / Gap rows, side by side vs Zoho; first image to the user for approval.
- Map results onto open tickets: NDC-2752 gaps 1–9, 2805, 2824, 2827, 2821, the 11 Nov layout draft (and settle its 2 "to confirm" points).
- HTML report published privately.

## Gates
- Gate 1 (now): user approves this plan + decisions below.
- Gate 2: user reviews report + images before ANY Plane write; filing fields asked then.
- Cleanup of QA SK12 data (TAVI, and Zoho if writes allowed) after review, with approval.

## Decisions needed
1. Zoho writes: allow QA skills / skill types / test tickets in techsolutionsegypt (deleted after)? Without them, Zoho runtime rows (auto-add, assignment, limits) stay "not checked".
2. Scope: include SK-H assignment runtime in full (needs agents online, slow), or Skills-only first?
3. Automation: keep the API/UI scripts as reusable automation (selenium-test-automation) or plain run scripts?
