# Desk automation: what Zoho Desk has that TAVI Desk is missing

Draft for review, 8 Nov 2026. Local only; nothing is filed. Reference: Zoho Desk. Build: staging-desk, bundle `index-CJUeskGi.js`.

## How sure each item is

- **Seen live:** read from the running tenant's API today.
- **Bundle:** searched today's frontend code. Absence is weak evidence, and two locale files could not be read, so these need a look on screen.
- **Earlier run:** seen in a past run on an older build.
- **Check on screen:** the code can't settle it.

Numbers stay the same if an item is skipped. No item here has been confirmed on screen today. Part A confirms them, and annotated TAVI vs Zoho images follow for what is still open. Zoho facts come from `reference/zoho-docs-inventory-sla-notifications-macros.md` and the three older inventories.

## Already filed, not repeated

- Known open or retest items stay in their tickets: NDC-2275, NDC-1978, NDC-2752, NDC-2805, NDC-2821, NDC-2203, NDC-2266, NDC-2389, NDC-2754, NDC-1987, NDC-2760, NDC-1973.
- 55 of the 73 older gaps now appear built in the bundle (`reference/gap-recheck-existing-features.md`). They are not listed as missing. Part A and Group Z test that they really work.

## Missing: direct assignment

1. Ticket criteria have fewer contact fields: 17 against Zoho's 26, and Is Escalated was not found. Earlier run + Bundle.
2. AI suggestion of a ticket owner. Skipped for now.
3. API: no ticket-count call, and fetching one rule is not confirmed. Bundle.

## Missing: workflow

4. One rule can't combine Create or Edit with ticket events such as Customer Reply. Bundle.
5. Conditions on Name and To Address were not found. Bundle.
6. Alerts to typed outside email addresses were not found; contact and team are there. Bundle.
7. Zoho Cliq notification action. Slack, Teams and Google Chat exist. Bundle.
8. AI actions. Skipped for now.

## Missing: SLA

9. SLA target conditions have no number or date operators (less than, greater than, between, is before, is after). TAVI offers 9 text-style operators. Seen live in `/desk/sla/meta`.
10. "Violations by hour of day" dashboard widget. From NDC-2266, never confirmed. Check on screen.
11. Countdown view of tickets by time left. From NDC-2266. A `countdown` string exists but its meaning is unclear. Check on screen.
12. Predefined views Response Overdue and SLA Violated. Only generic Overdue strings were read. Check on screen.
13. SLA static report and Agent Performance SLA metrics. Check on screen.
14. Contract expiry alert (whom to notify, days before). Check on screen.
15. Business hours block past midnight is refused. Earlier run. Check on screen.

## Missing: round robin

No open item. Bugs from the 6–7 Nov run are retested in Part A.

## Missing: blueprint

16. Widgets in the transition form. Bundle.
17. Choosing public or private reply for the reply transition. Ratings are there. Bundle.
18. Separate holiday list picker for a state. Business-hours set is there. Bundle.
19. Agent filter on the Blueprint dashboard. Bundle.
20. Saving a half-done transition has an API but no readable screen text. Check on screen.

## Missing: notifications

Today's Customer Support department has 37 rules against Zoho's 51.

21. "Assigning a blueprint transition" (agent). Seen live.
22. Contact "Receiving a reply". Seen live.
23. CC "Receiving a reply", separate from the acknowledgement. TAVI's single CC reply rule is an acknowledgement. Seen live + Bundle.
24. Separate call, task and event rules. NDC-2389 asked for activity rules; TAVI now has one "activity" rule for each of assigned, completed and mentioned. It may be a deliberate design. Seen live.
25. Feed preferences per department (Setup › Notifications). Nothing found. Bundle.
26. Notification Center @Mentions filter and the personal settings page. Already in NDC-2389, listed only to retest. Check on screen.

## Missing: macros

27. Custom function action. TAVI has 9 action kinds and none runs a custom function. Bundle.
28. Reusable saved actions shared between macros. Bundle.
29. Applying a macro to up to 50 selected tickets. The menu is used by list pages, but the Mass Actions page has no macro entry. Check on screen.
30. Bulk Actions log showing macro runs and failure reasons. Check on screen.

## Missing: other automation

31. Supervisor rules. Nothing in the bundle and the API route tried returns 404. NDC-1973, NDC-2760.
32. Automation Studio. Nothing in the bundle. Zoho's SLA FAQ lists it last in the order.
33. Schedules. Route tried returns 404, but `/schedules` strings exist. Check on screen.
34. Webhook list and public API keys. Webhook exists only as an action. Bundle.

## Could not be checked

- **SMS channel:** skipped for now. The code says "No SMS gateway is configured on this platform".
- **Instant messaging actions:** skipped for now. They are offered only with a connected brand.
- **Mobile apps:** skipped for now.

## Additional notes

- Not gaps, TAVI goes further:
  - 50 SLA targets against Zoho's 10.
  - Reapply SLA to open tickets (Zoho documents none).
  - Macro comment and resolution actions, macros for all departments.
  - Rating received and reply-not-delivered notification rules.
- Not gaps, API-only in Zoho: support plan types HOURS and PRICE. Zoho's own screens show 2 types.
- Possible issue to check separately: `GET /workflow/rules` returns at most 50 rules with no paging, and the tenant had 54. Does the rules screen also hide some?
- Possible issue to check separately: the direct rule list returned the same 38 rules for every department filter.
- Zoho's docs contradict themselves on 29 points. Those that matter are marked `[zoho-live]` in the spec instead of being treated as fact.
- Also compared with NDC-2389: items 21, 22 and 23 are not in that ticket. Its template gaps (per department, placeholders, raw HTML and others) are retested, not repeated here.
- The tenant change for this work was the 9 inactive workflow rules you asked me to delete.
