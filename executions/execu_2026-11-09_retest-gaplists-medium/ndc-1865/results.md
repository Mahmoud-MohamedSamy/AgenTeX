# NDC-1865 Desk Features Testing: availability check, 10 Nov 2026

Presence only (screen + list API), not a retest. NDC-Staging, ndc-staging-owner, read-only: pages opened, nothing created, edited, deleted, sent or switched. Setup map: evidence/raw/00-setup-home.png.

| # | Feature | Where in TAVI Desk | API (GET) | Verdict | Detailed ticket |
|---|---|---|---|---|---|
| 1 | Modules and Fields | Setup → Customization → Modules and Fields (/settings/modules-and-fields): Modules, Ticket Status, Web Tabs, Global Sets | /modules 200 [10], ticket fields 200 [141] | Available | NDC-2174 |
| 2 | Activity Life Cycle | Top nav Activities: All Activities, Tasks, Calls, Events | Calls/Events/Tasks modules 200; ~527 activities, 397 tasks (Lane E) | Available | NDC-2635, NDC-2830 |
| 3 | Direct Assignment Rules | Setup → Automation → Assignment Rules → Direct Assignment | /desk/assignment-rules 200 | Available (list switch currently Off) | NDC-1978, NDC-2275 |
| 4 | Workflows | Setup → Automation → Workflow Rules; Actions | /workflow/rules 200 [46], /workflow/actions 200 [8] | Available | workflow rules intake |
| 5 | SLAs | Setup → Automation → SLA & Escalation (per department); Support Plans | /desk/sla/policies 200 [0 in Customer Support] | Available | NDC-2754 |
| 6 | Round Robin Assignment | Assignment Rules → Round Robin (per department; load, skill, sequence) | /desk/assignment-rules 200 (3 rules in Customer Support) | Available | NDC-2275, NDC-2752 |
| 7 | Blueprints | Setup → Automation → Blueprints (per department) | /modules/{tickets}/blueprints 200 [8] | Available | NDC-2754 |
| 8 | Notification rules | Setup → Customization → Notifications (per department, email + SMS, template per rule) | /desk/notification-rules/departments/{id} 200 | Available | — |
| 9 | Automation Studio | No page by that name; /settings/automation/automation-studio redirects to Home. Setup search "automation" lists Workflow Rules, Actions, SLA & Escalation, Support Plans, Assignment Rules, Macros, Blueprints, AI Tagging, Ticket Archiving, Time Tracking | none | Not available as a named feature (closest: the Automation menu) | — |
| 10 | Data Administration (excl. Backup) | Setup → Data Administration: Recycle Bin, Export, Import, Bulk Actions Log; Audit Log under Security | /audit/recycle-bin/items 200 [50], /desk/data/exports 200 [0], /audit/events 200 [50] | Available | — |
| 11 | Collaboration | Team Feeds (top-level: feeds, Mentions, Following, Direct messages; Setup → Team Feeds); Collaboration Tools (Slack enabled, Google Drive, MS Teams, Google Chat); ticket Comment (Shift+C) | /desk/feeds/* 200, /desk/collaboration/catalog + connections 200 | Available | — |
| 12 | Ticketing Reply | Ticket page: Reply All, More ways to reply, Comment, Close Ticket; Scheduled Replies in the left rail | ticket page APIs 200 | Available | NDC-2636, NDC-2831 |
| 13 | Email Templates | Setup → Customization → Email Templates (folders) | /desk/email-templates 200, /folders 200 | Available | — |
| 14 | CRM ⇄ Desk integration | Setup → Integrations → CRM ⇄ Desk Integration: Connected since 5 Nov 2026; Overview, Configuration, Permissions, Sync History, Failure Log | /desk/integrations/crm/status + config 200 | Available. Note: 423 sync changes "Parked" (gave up after repeated failures) | NDC-2392 |

Totals: 13 available, 1 not available as a named feature (Automation Studio).

Not done: the Activities page was not re-captured in this pass (top-nav click timed out); evidence is Lane E's bugs-draft/evidence/raw/b2-agent-activities-list.png and b2-agent-list-search.png from the same day.

## NDC-1865 posted 10 Nov 2026
Comment 1b3fd991-25ac-4655-a4b1-1328d099f292 + 21 screenshots (evidence/raw except 09-*, plus b2-agent-activities-list.png). State unchanged (Backlog).
