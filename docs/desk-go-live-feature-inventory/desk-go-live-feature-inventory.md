# TAVI Desk — go-live feature inventory vs Zoho Desk (Enterprise)

1 Nov 2026 · staging-desk.taviportal.com, org Anyware, owner account · reference: Zoho Desk Enterprise trial (org techsolutionsegypt) + Zoho Desk help centre (2,491 items, reference/zoho-desk-inventory.md).

**How to read the status.** *Built* = the screen and its API exist in today's build (bundle index-CA-OX4H6.js, settings hub, page tour). Whether it **works** is decided in the wave runs, not here. *Partly* = exists but a known part is missing. *Missing* = Zoho has it, TAVI has no screen or API. *In development* = TAVI shows an "In Development" page. *Not confirmed* = could not be checked yet (page did not load or no string found). *TAVI-only* = TAVI has it, Zoho does not.

**Totals (131 features):** Built 82 · Partly 20 · Missing 16 · TAVI-only 6 · Not confirmed 5 · In development 2  
**Priority:** P0 57 · P1 42 · P2 30 · — 2

Open Plane items are taken from the Desk module sweep (reference/plane-desk-items.md, 353 items). Items in brackets (Done / RFT) are listed for context.

## Wave 1 — Organisation & access (15)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| O-01 | Organisation | Company profile (name, logo, time zone, locale, currency) | Built | /settings/organization/company — Wave 1: validation bug (NDC-2776), audit time zone bug (NDC-2779) | NDC-1970, NDC-2776, NDC-2779 | P0 |
| O-02 | Organisation | Rebranding (logo, favicon, colours, portal name) | Built | /settings/rebranding/company-logo | NDC-1992 | P1 |
| O-03 | Organisation | Business hours (24x7 / custom, several sets, multi-block days) | Partly | /settings/organization/business-hours — Wave 1: two blocks per day work; a block past midnight is refused ("slots cannot cross midnight") | NDC-1952, NDC-2266 | P0 |
| O-04 | Organisation | Holiday lists (per business-hours set, yearly repeat) | Built | /settings/organization/holidays | — | P1 |
| O-05 | Organisation | Departments (create, default, members, per-dept settings, disable) | Built | /settings/organization/departments — Wave 1: lost update between two admins (NDC-2777) | NDC-2733, NDC-2777 | P0 |
| A-01 | Access | Agents (invite, activate/deactivate, light agents, per-dept) | Built | /settings/users-control/agents — Wave 1 (NDC): invite/resend/cancel pass; inviting an active user's email makes a 2nd user (NDC-2778) | NDC-2736, NDC-2778 | P0 |
| A-02 | Access | Roles and hierarchy (role-based visibility) | Built | /settings/users-control/roles | NDC-2701 | P0 |
| A-03 | Access | Profiles and permissions (module/action/settings permissions) | Built | /settings/users-control/profiles — Wave 1: NDC-2305 passes; built-in profile rename refused | NDC-2305 (passes), NDC-2702 | P0 |
| A-04 | Access | Teams (members, team queue, team assignment) | Built | /settings/users-control/teams, Team Queue tab | NDC-1953 | P0 |
| A-05 | Access | Data sharing rules (private / public per module, sharing rules) | Built | /settings/users-control/data-sharing | — | P0 |
| A-06 | Access | Ticket access (department / team / owner visibility, share with dept) | Built | /settings/users-control/ticket-access — Wave 1: NDC-2303 fixed (Done 2 Nov) | NDC-2303 (Done), NDC-2196, NDC-2376 | P0 |
| A-07 | Access | Field-level permissions per profile | Built | Modules and Fields › field permissions — Wave 1: NDC-2387 fixed (Done 2 Nov) | NDC-2387 (Done) | P0 |
| A-08 | Access | Agent sign-in security: SSO/SAML, 2FA, allowed IPs, session policy | Missing | no Desk settings page; only IAM session limit | NDC-1977, NDC-2760 | P1 |
| A-09 | Access | Audit log (who changed what, filters, export) | Built | /settings/security/audit-log — Wave 1: every write logged; company save logs a false time zone change (NDC-2779) | NDC-2511, NDC-2779 | P0 |
| Q-04 | Cross-cutting | My profile, signatures, personal time zone/date format | Partly | /settings/my-profile → /hq; signatures in desk.mySignatures | NDC-1970 | P1 |

## Wave 2 — Ticket daily work (39)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| T-01 | Tickets | List views: system views, custom views, starred views, sort, filters | Built | /views/all/tickets (STARRED / ALL VIEWS), records.views, filters | NDC-2211(Done) | P0 |
| T-02 | Tickets | View modes: table, compact/classic, kanban board, peek | Built | records.viewMode, records.board, records.peek | — | P0 |
| T-03 | Tickets | Agent Queue / Team Queue / Tags tabs | Built | left rail Agent Queue, Team Queue, Tags | — | P0 |
| T-04 | Tickets | Create ticket (layout per department, templates, quick create) | Built | DeskCreateRecordPage, ticketTemplatePicker | NDC-2661 | P0 |
| T-05 | Tickets | Ticket detail: properties, conversation, history, tabs, pins | Built | tickets.properties/conversation/history/pins | NDC-2660 | P0 |
| T-06 | Tickets | Reply, reply all, forward, CC/BCC, signatures, send as email | Built | tickets.composer, cc, sendAsEmail, mySignatures | NDC-2636, NDC-2377 | P0 |
| T-07 | Tickets | Private comments, mentions, comment visibility | Built | tickets.commentVisibility, mentions | — | P0 |
| T-08 | Tickets | Reply drafts saved on the server | Partly | draft in browser storage only | NDC-2644 | P1 |
| T-09 | Tickets | Scheduled replies (schedule, list, cancel, clear to draft) | Built | /scheduled-replies, tickets.scheduled | NDC-2184 | P1 |
| T-10 | Tickets | Snippets / canned responses and email templates in composer | Built | tickets.snippets, tickets.emailTemplates | — | P0 |
| T-11 | Tickets | KB article suggestions in composer | Partly | tickets.kbSuggest ("could not be loaded" seen 26 Oct) | NDC-2636 | P1 |
| T-12 | Tickets | Assign / reassign owner and team, pick up | Built | tickets.ownership, /desk/tickets/{id}/assign|pick-up | NDC-2355 | P0 |
| T-13 | Tickets | Status, priority, due date, on-hold, close / reopen | Built | closeDialog, reopenDialog, statusValues | — | P0 |
| T-14 | Tickets | Move ticket to another department (with layout mapping) | Built | tickets.moveDialog, layoutDialog | — | P0 |
| T-15 | Tickets | Share ticket with departments (full / read-only / restricted) | Built | tickets.shareDialog | NDC-2303, NDC-2376 | P0 |
| T-16 | Tickets | Merge tickets | Built | tickets.merge | NDC-2093(Done) | P0 |
| T-17 | Tickets | Split ticket from a thread | Built | tickets.split | — | P1 |
| T-18 | Tickets | Clone ticket | Not confirmed | no clone string found in desk-tickets locale | — | P2 |
| T-19 | Tickets | Parent / child tickets | Built | tickets.parentChild | — | P1 |
| T-20 | Tickets | Mark spam / spam view, blocked senders | Built | tickets.spamDialog, channels.spam/blocked | — | P0 |
| T-21 | Tickets | Delete / restore (Recycle Bin) | Partly | delete works; Delete forever fails for Desk items | NDC-2248, NDC-2516, NDC-2517 | P0 |
| T-22 | Tickets | Tags (add/remove, tag page, AI tagging) | Built | tickets.tags, desk.tags, AI Tagging setup | — | P1 |
| T-23 | Tickets | Follow ticket / followers | Built | followers via workflow AddTicketFollowers; header follow | — | P1 |
| T-24 | Tickets | Attachments (upload, preview, size limits, annotator) | Partly | tickets.attachments; no image annotator | NDC-2753 | P0 |
| T-25 | Tickets | Collision detection (others viewing / replying) | Built | tickets.viewers | NDC-1965 (RFT) | P0 |
| T-26 | Tickets | Time entries and timer (auto timer, billable, close-timer prompt) | Built | tickets.timer, tickets.time, /settings/tickets/time-tracking | — | P1 |
| T-27 | Tickets | Approvals on a ticket | Built | tickets.approval | — | P1 |
| T-28 | Tickets | Review (send reply for review before sending) | TAVI-only | tickets.review | — | P2 |
| T-29 | Tickets | Resolution field and resolution history | Built | tickets.resolution | — | P1 |
| T-30 | Tickets | Print / export ticket | Built | tickets.print | — | P2 |
| T-31 | Tickets | Bulk actions (assign, status, mass update, mass delete, export) | Built | records.bulk, records.mass, tickets.bulk | — | P0 |
| T-32 | Tickets | Ticket archiving (rules, archived view, restore) | Built | /settings/tickets/archiving, tickets.archive | — | P2 |
| T-33 | Tickets | Ticket number format (prefix/suffix per department) | Built | /settings/tickets/numbering | — | P1 |
| T-34 | Tickets | Ticket templates | Built | /settings/tickets/templates | — | P1 |
| T-35 | Tickets | Macros (one-click updates) | Built | /settings/automation/macros, tickets.macros (0 macros) | NDC-1987 | P1 |
| T-36 | Tickets | Contract / SLA panel on ticket | Built | tickets.contract, tickets.sla | — | P1 |
| T-38 | Tickets | AI on ticket: summary, sentiment, reply suggestion | Partly | tickets.ai (69 strings) — check what runs | NDC-2004, NDC-2005 | P2 |
| T-40 | Tickets | Keyboard shortcuts and global search (Ctrl K) | Built | "Search or jump to… Ctrl K", /search (241 hits for "test") | — | P1 |
| Q-03 | Cross-cutting | Notifications bell (in-app) and desktop notifications | Built | desk.bell | — | P1 |

## Wave 3 — Automation (14)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| U-01 | Automation | Assignment rules: direct + round robin, criteria, order | Built | /settings/automation/assignment-rules | NDC-2275, NDC-1978, NDC-2714 | P0 |
| U-02 | Automation | Round-robin preferences (thresholds, online-only, backlog) | Partly | see NDC-2275 requirements | NDC-2275 | P0 |
| U-03 | Automation | Skills and skill-based routing | Partly | Assignment Rules › Skills tab | NDC-2752 | P1 |
| U-04 | Automation | Workflow rules (triggers, criteria, instant + time-based actions) | Built | /settings/automation/workflow-rules | NDC-2662, NDC-2731, NDC-2204, NDC-2205, NDC-2510 | P0 |
| U-05 | Automation | Workflow action library (email, task, field update, webhook, custom function) | Built | /settings/automation/actions (15 types) | NDC-2726, NDC-2728 | P0 |
| U-06 | Automation | Workflow triggers on customer reply / agent reply / rating | Built | TicketEvent trigger | NDC-1986 (RFT) | P0 |
| U-07 | Automation | SLA policies (targets per priority, business hours, escalation levels) | Built | /settings/automation/sla (2 active, 1 inactive) | NDC-2266, NDC-2267 | P0 |
| U-08 | Automation | Support plans and contracts (entitlements) | Built | /settings/automation/support-plans, desk_contracts | — | P1 |
| U-09 | Automation | Blueprints (states, transitions, before/during/after, SLA per state) | Built | /settings/automation/blueprints | NDC-2754, NDC-2753, 2755-2757 | P0 |
| U-10 | Automation | Supervisor rules (time-based checks on ticket age) | Missing | not in settings hub | NDC-1973, NDC-2760 | P1 |
| U-12 | Automation | Notification rules per department (customer / agent emails) | Built | /settings/customization/notifications | NDC-2389 | P0 |
| U-13 | Automation | Custom functions (Deluge-like) and custom actions | TAVI-only | custom-actions namespace (1,138 strings) | — | P1 |
| U-15 | Automation | AI tagging | Built | /settings/automation/ai-tagging | NDC-2003 | P2 |
| U-16 | Automation | Auto-close / time-based ticket rules | Partly | blueprint state limit + archiving; no general auto-close | NDC-1973 | P1 |

## Wave 4 — Channels & self service (12)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| O-08 | Organisation | Multi-brand / custom portal domain | Partly | help center on staging-crm host path only | NDC-1992 | P2 |
| T-37 | Tickets | Customer happiness rating on ticket | Built | tickets.happiness | — | P1 |
| N-01 | Channels | Email: support addresses, forwarding, domains, outgoing (from) addresses | Built | /settings/channels/email (1 address, 1 domain, "Mail is arriving") | NDC-1999, NDC-1479 | P0 |
| N-02 | Channels | Email: spam filter, blocked addresses, suppressions | Built | channels.spam/blocked/suppressions | — | P1 |
| N-03 | Channels | Email providers (Gmail / Microsoft / SMTP connect) | Built | /settings/integrations (Email Providers) | — | P0 |
| N-04 | Channels | Email templates (placeholders, per department, languages) | Built | /settings/organization/email-templates | NDC-2389, NDC-1984 | P0 |
| N-05 | Channels | Web forms + feedback widget (embed code, hosted link) | Partly | /settings/channels/web-forms; embed broken | NDC-2751, NDC-2732, NDC-1488, NDC-1993 | P0 |
| N-06 | Channels | Help Center (portal, sign-up, ticket submit, my tickets, KB, branding, SEO, languages) | Built | /settings/channels/help-center (live on staging-crm host) | NDC-1990 (RFT), NDC-2263, NDC-2264, NDC-2265 | P0 |
| N-07 | Channels | Community (forums, topics, moderation, categories) | Built | /community (12 topics, moderation queue), /settings/channels/community | — | P1 |
| N-08 | Channels | Knowledge base (articles, categories, drafts, review, expiry, templates, gallery) | Built | /knowledge-base (5 categories), KB settings, templates | NDC-2651 | P0 |
| N-09 | Channels | KB translations and article versions | Not confirmed | check KB editor | — | P1 |
| N-10 | Channels | Customer happiness ratings (settings, email link, public page) | Built | /settings/organization/customer-happiness, PublicHappinessPage | NDC-1997, NDC-2170 | P1 |

## Wave 5 — Customers, activities, insight, data, customization, integrations (34)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| O-06 | Organisation | Products (catalogue, per department, link to tickets) | Built | /settings/organization/products + desk_products module | — | P2 |
| A-11 | Access | Privacy: data subject requests, read receipts, attachment controls | Missing | not in settings hub (only Data Retention + legal hold) | NDC-2760 | P1 |
| A-12 | Access | Data retention and legal hold | TAVI-only | /settings/data/retention, desk-tickets.legalHold | — | P1 |
| U-14 | Automation | Webhooks (outgoing) and public API keys | Partly | webhook action exists; no public API key page | NDC-2009 | P1 |
| C-01 | Customers | Contacts (CRUD, views, find duplicates, merge, portal access) | Built | /modules/{contacts} (105 contacts, Find duplicates) | — | P0 |
| C-02 | Customers | Accounts (CRUD, contacts under account, hierarchy) | Built | /modules/{accounts} | — | P0 |
| C-03 | Customers | Customer 360: tickets, happiness, activities on the contact page | Built | CustomerDetailPage, desk.customers | — | P1 |
| C-04 | Customers | Contracts (with support plan, validity) | Built | desk_contracts, desk.contracts | — | P1 |
| C-05 | Activities | Tasks, calls, events (CRUD, reminders, overdue, complete) | Built | /activities (8) | NDC-2635, NDC-2637..2642 | P1 |
| C-06 | Activities | Calendar (month / week / day, all users) | Built | /calendar | — | P2 |
| I-01 | Insight | Headquarters dashboard (components, request/response trend, unassigned) | Built | /hq | NDC-2346, NDC-2351, NDC-2352 | P0 |
| I-02 | Insight | Reports (standard, custom, scheduled, export) | Not confirmed | /analytics stuck on "Loading your departments…"; /reports → /hq | NDC-2364, NDC-2068 | P0 |
| I-03 | Insight | Dashboards (standard + custom) | Not confirmed | /dashboards → /hq; DashboardsLibraryPage exists | NDC-2364 | P0 |
| I-04 | Insight | Team feeds (department feed, mentions, direct messages) | Built | /team-feeds | — | P2 |
| D-01 | Data | Import (CSV/Excel, mapping, validation, undo 30 days, history) | Built | /settings/data/import | NDC-2512, NDC-2513, NDC-2515 | P0 |
| D-02 | Data | Export (module, view, fields, 7-day download) | Built | /settings/data/export | NDC-2494 | P0 |
| D-03 | Data | Data backup (ZIP of CSV, password) | Built | /settings/data/backup | NDC-2494 | P1 |
| D-04 | Data | Migration from another help desk (Zwitch) | Built | /settings/data/migration (Freshdesk runs today) | — | P1 |
| D-05 | Data | Sandbox | Partly | /settings/data/sandboxes shows ERROR; create never finishes | NDC-2514 | P2 |
| D-06 | Data | Bulk actions log | Built | /settings/data/bulk-actions | — | P1 |
| D-07 | Data | Recycle Bin (restore, delete forever, empty) | Partly | see T-21 | NDC-2248, NDC-2516, NDC-2517 | P0 |
| D-08 | Data | Data archive | TAVI-only | /settings/data/archive | — | P2 |
| X-01 | Customization | Modules and tabs (custom modules, web tabs, organize tabs) | Built | /settings/modules-and-fields, /settings/organize-tabs | NDC-2174, NDC-2235, NDC-2251 | P0 |
| X-02 | Customization | Layouts and fields (per-dept layouts, field types, picklists) | Built | Modules and Fields | NDC-2174, NDC-2222, NDC-1630 | P0 |
| X-03 | Customization | Layout rules, validation rules, dependent picklists | Partly | saved but not applied | NDC-2230, NDC-2231, NDC-2535, NDC-1988 | P0 |
| X-05 | Customization | Languages (portal + agent UI, RTL) | Partly | EN/AR switch; no Languages setup page for Desk content | NDC-2488, NDC-2487 | P1 |
| X-06 | Customization | Data types and capabilities catalogue | TAVI-only | /settings/data-types, /settings/capabilities | — | P2 |
| G-01 | Integrations | CRM ⇄ Desk integration | Built | /settings/integrations/crm | NDC-2392, NDC-2399 | P0 |
| G-02 | Integrations | Collaboration tools (Slack / Teams) | Built | /settings/integrations/collaboration | — | P2 |
| G-03 | Integrations | API integration config page | Partly | hub link /settings/integration-config redirects to /hq | — | P2 |
| G-06 | Integrations | Analytics app (Tavi Analytics for Desk) | Partly | Analytics tab; see I-02 | NDC-2068, NDC-2364 | P1 |
| Q-01 | Cross-cutting | Arabic UI and RTL on every Desk screen | Built | EN/AR switch in header | NDC-2488, NDC-2487 | P0 |
| Q-02 | Cross-cutting | Accessibility settings (font size, contrast, motion) | Built | AccessibilitySettingsForm | — | P2 |
| Q-05 | Cross-cutting | Performance: list/detail under load targets | Not confirmed | staging slow 1 Nov (pages >5 s) | — | P0 |

## Not in go-live run (missing / in development) (17)

| Id | Area | Feature | TAVI status | Evidence | Open Plane items | Priority |
|---|---|---|---|---|---|---|
| O-07 | Organisation | Gamescope (agent gamification) | Missing | not in settings hub | NDC-2760 | P2 |
| A-10 | Access | Zia Agents / AI agent seats | TAVI-only | built-in "AI Agent" profile (Omnichannel) | NDC-2702 | P2 |
| T-39 | Tickets | Ticket translation | Missing | no translate string on ticket | NDC-2005, NDC-2760 | P2 |
| T-41 | Tickets | Telephony panel on ticket (click to call) | Partly | tickets.telephony (4 strings); no Phone channel setup | NDC-2008 | P2 |
| T-42 | Tickets | Read receipts for replies | Missing | not found | NDC-2636, NDC-2760 | P2 |
| U-11 | Automation | Schedules (run custom function on a schedule) | Missing | not in settings hub | NDC-1989, NDC-2760 | P2 |
| N-11 | Channels | Live chat | In development | /chat shows "In Development" (Omnichannel app) | NDC-2000 | — |
| N-12 | Channels | Social channels (Facebook, Instagram, X, WhatsApp) | In development | /social shows "In Development" | NDC-1667, NDC-2000 | — |
| N-13 | Channels | Phone / telephony channel | Missing | no Phone setup page | NDC-2760 | P2 |
| N-14 | Channels | Instant messaging (WhatsApp/Telegram/LINE) | Missing | Omnichannel only | NDC-2000, NDC-2760 | P2 |
| N-15 | Channels | Guided conversations | Missing | not in settings hub | NDC-1994, NDC-2760 | P2 |
| N-16 | Channels | ASAP help widget / mobile SDK | Missing | not in settings hub | NDC-1995, NDC-2760 | P2 |
| N-17 | Channels | Help Center SSO (SAML / OIDC / social sign-in) | Missing | — | NDC-2264, NDC-2760 | P2 |
| I-05 | Insight | Radar mobile app / agent mobile app | Missing | no mobile app | NDC-1998 | P2 |
| X-04 | Customization | Buttons (custom buttons on ticket) | Missing | not in settings hub | NDC-2760 | P2 |
| G-04 | Integrations | Marketplace / extensions, Jira, Shopify, Zapier | Missing | — | NDC-2013 | P2 |
| G-05 | Integrations | Developer space: APIs page, connections, functions, webhooks list | Missing | no developer space menu | NDC-2009, NDC-2760 | P1 |

## Gaps (Missing + Partly): 36

- **O-03** Business hours (24x7 / custom, several sets, multi-block days) — Partly. /settings/organization/business-hours — Wave 1: two blocks per day work; a block past midnight is refused ("slots cannot cross midnight"). Plane: NDC-1952, NDC-2266
- **O-07** Gamescope (agent gamification) — Missing. not in settings hub. Plane: NDC-2760
- **O-08** Multi-brand / custom portal domain — Partly. help center on staging-crm host path only. Plane: NDC-1992
- **A-08** Agent sign-in security: SSO/SAML, 2FA, allowed IPs, session policy — Missing. no Desk settings page; only IAM session limit. Plane: NDC-1977, NDC-2760
- **A-11** Privacy: data subject requests, read receipts, attachment controls — Missing. not in settings hub (only Data Retention + legal hold). Plane: NDC-2760
- **T-08** Reply drafts saved on the server — Partly. draft in browser storage only. Plane: NDC-2644
- **T-11** KB article suggestions in composer — Partly. tickets.kbSuggest ("could not be loaded" seen 26 Oct). Plane: NDC-2636
- **T-21** Delete / restore (Recycle Bin) — Partly. delete works; Delete forever fails for Desk items. Plane: NDC-2248, NDC-2516, NDC-2517
- **T-24** Attachments (upload, preview, size limits, annotator) — Partly. tickets.attachments; no image annotator. Plane: NDC-2753
- **T-38** AI on ticket: summary, sentiment, reply suggestion — Partly. tickets.ai (69 strings) — check what runs. Plane: NDC-2004, NDC-2005
- **T-39** Ticket translation — Missing. no translate string on ticket. Plane: NDC-2005, NDC-2760
- **T-41** Telephony panel on ticket (click to call) — Partly. tickets.telephony (4 strings); no Phone channel setup. Plane: NDC-2008
- **T-42** Read receipts for replies — Missing. not found. Plane: NDC-2636, NDC-2760
- **U-02** Round-robin preferences (thresholds, online-only, backlog) — Partly. see NDC-2275 requirements. Plane: NDC-2275
- **U-03** Skills and skill-based routing — Partly. Assignment Rules › Skills tab. Plane: NDC-2752
- **U-10** Supervisor rules (time-based checks on ticket age) — Missing. not in settings hub. Plane: NDC-1973, NDC-2760
- **U-11** Schedules (run custom function on a schedule) — Missing. not in settings hub. Plane: NDC-1989, NDC-2760
- **U-14** Webhooks (outgoing) and public API keys — Partly. webhook action exists; no public API key page. Plane: NDC-2009
- **U-16** Auto-close / time-based ticket rules — Partly. blueprint state limit + archiving; no general auto-close. Plane: NDC-1973
- **N-05** Web forms + feedback widget (embed code, hosted link) — Partly. /settings/channels/web-forms; embed broken. Plane: NDC-2751, NDC-2732, NDC-1488, NDC-1993
- **N-13** Phone / telephony channel — Missing. no Phone setup page. Plane: NDC-2760
- **N-14** Instant messaging (WhatsApp/Telegram/LINE) — Missing. Omnichannel only. Plane: NDC-2000, NDC-2760
- **N-15** Guided conversations — Missing. not in settings hub. Plane: NDC-1994, NDC-2760
- **N-16** ASAP help widget / mobile SDK — Missing. not in settings hub. Plane: NDC-1995, NDC-2760
- **N-17** Help Center SSO (SAML / OIDC / social sign-in) — Missing. —. Plane: NDC-2264, NDC-2760
- **I-05** Radar mobile app / agent mobile app — Missing. no mobile app. Plane: NDC-1998
- **D-05** Sandbox — Partly. /settings/data/sandboxes shows ERROR; create never finishes. Plane: NDC-2514
- **D-07** Recycle Bin (restore, delete forever, empty) — Partly. see T-21. Plane: NDC-2248, NDC-2516, NDC-2517
- **X-03** Layout rules, validation rules, dependent picklists — Partly. saved but not applied. Plane: NDC-2230, NDC-2231, NDC-2535, NDC-1988
- **X-04** Buttons (custom buttons on ticket) — Missing. not in settings hub. Plane: NDC-2760
- **X-05** Languages (portal + agent UI, RTL) — Partly. EN/AR switch; no Languages setup page for Desk content. Plane: NDC-2488, NDC-2487
- **G-03** API integration config page — Partly. hub link /settings/integration-config redirects to /hq. Plane: —
- **G-04** Marketplace / extensions, Jira, Shopify, Zapier — Missing. —. Plane: NDC-2013
- **G-05** Developer space: APIs page, connections, functions, webhooks list — Missing. no developer space menu. Plane: NDC-2009, NDC-2760
- **G-06** Analytics app (Tavi Analytics for Desk) — Partly. Analytics tab; see I-02. Plane: NDC-2068, NDC-2364
- **Q-04** My profile, signatures, personal time zone/date format — Partly. /settings/my-profile → /hq; signatures in desk.mySignatures. Plane: NDC-1970
