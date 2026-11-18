# Findings found on 17 Nov 2026: retest list

| Id | Plane | Sev | Title | Origin | Lane |
|---|---|---|---|---|---|
| F01 | — | High | Staging: incoming email, ticket history, round robin, ticket numbers stopped (background processing) | r20 finding 1 | WF |
| F02 | NDC-2997 (comment) | Medium | Workflow Rules: Owner Assignment re-fires its own On Edit rule after the background owner write | r20 finding 2 | WF |
| F03 | NDC-3058 (comment) | Medium | Workflow Rules: Add Tags picker offers and applies other departments' tags | r20 finding 3 | WF |
| F15 | — | Info | Workflow Rules: run detail shows raw ids and empty Details | r20 finding 15 | WF |
| F17 | NDC-3105 | — | Workflow Rules: failed action shows "Cancelled", run shows "Fired", no failed filter | r20 bugs/wf-failed-action-shows-cancelled.md | WF |
| F04 | NDC-3065 (comment) | Medium | Blueprint: agent loses access to another person's ticket right after running its transition | r20 finding 4 | BP |
| F07 | — | Low | Departments: disabling a department with a transfer target moves tickets to the default department | r20 finding 7 | BP |
| F09 | — | Low | Blueprint: huge time limit gives schema error toast; fractions/negatives change silently | r20 finding 9 | BP |
| F06 | — | Low | Contracts: department-only change keeps the other department's plan (Zoho refuses, seen live in r20) | r20 finding 6 + notes NDC-2841 vs Zoho | TK |
| F08 | — | Low | Tickets: Mark as Spam gives no sharing warning; wrong re-share wording; custom action on spam ticket | r20 finding 8 | TK |
| F10 | — | Low | Records API: some malformed field values give a vague error path | r20 finding 10 | TK |
| F11 | — | Low | Contracts: help text repeats words; plan error stays after the right plan is picked | r20 finding 11 | TK |
| F12 | — | Low | Ticket Views: sidebar count stays old after bulk delete | r20 finding 12 | TK |
| F13 | — | Info | Tickets: Clone sets the current user as Ticket Owner (Zoho keeps the source owner) | r20 finding 13 | TK |
| F16 | NDC-3104 | — | Email: reply acknowledgement subject repeats "Re:" and the ticket number | r20 bugs/reply-ack-subject-repeats.md | TK |
| F05 | NDC-2934 (comment) | Med/Low | CRM Reports: reports keep the old Score after a background rescore | r20 finding 5 | SC |
| F14 | NDC-2934 (comment) | Info | Scoring: score workflow does not run on background rescore; Run scoring rules has no confirmation | r20 finding 14 | SC |
| C1 | NDC-3101 | High | CRM Currency: changing the company currency does not change the home currency | currency run | SC |
| C2 | NDC-3103 | High | CRM Audit Log lists Desk changes | currency run | SC |
| C3 | draft B1 | — | CRM Currency: a currency added in Settings cannot be used on records | currency run | SC |
| C4 | draft B2 | — | CRM Currency: Create Deal has no Currency field and shows $ | currency run | SC |
| C5 | draft B3 | — | CRM Currency: a currency used by records can be deleted | currency run | SC |
| C6 | draft B4 | — | CRM Currency: Add currency accepts a non-ISO code and rounds the rate | currency run | SC |
| A1 | NDC-3095 | Low | Ticket access: ticket cannot be moved from the ticket list | access run AC-G1 | AC |
| A2 | NDC-3096 | Low | Ticket access: no message when another agent moves the ticket you have open | access run AC-G2 | AC |
| A3 | NDC-3097 | Low | Teams: light agent can be put in a team and get team tickets | access run AC-G3 | AC |
| A4 | NDC-3098 | Medium | Access: no per-agent ticket access level | access run AC-G5 | AC |
| A5 | NDC-3099 | Low | Followers keep notifications for a ticket moved out of their department | access run AC-G6 | AC |
| A6 | NDC-3100 | Low | Agents: agent page shows raw keys in "Tickets owned" | access run AC-B1 | AC |
| A7 | decision | — | Ticket access: peers can read but not edit (Zoho: read + edit) | access run AC-08 | AC |
