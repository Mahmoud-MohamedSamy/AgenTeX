# Retest r22 — MahmoudMohamed — 19 Nov 2026 (33 tickets)

| Ticket | Verdict | Notes |
|---|---|---|
| NDC-3059 | PARTIAL | CES2 view-only in QA RT20 B2 Dept: record edits 403 (open + Closed), replies/drafts/close 403 TICKET_WRITE_FORBIDDEN, public comment 403, private comment 201; UI read-only banner, no Edit/Close, Resolution/Attachment nothing to edit. STILL: Reply All shown + full composer; refused only on Send for review. PATCH /desk/tickets 200 no-op (also owner). Dept restored. |
| NDC-3098 | PASS | Agent page Ticket access (departments / own_team_unassigned / own_and_unassigned), PUT /desk/agents/{id}/ticket-access. Tenant data sharing Private on staging → switched to Public R/W/D for test, restored. CES2 own+unassigned: CES1/owner tickets 404/403, own+unassigned 200; back to departments: 200. Transient right after Public switch: GET 404 but record PATCH 200 on owner ticket (resolved on recheck). Not checked: own+team option. |
| NDC-3077 | PASS | 10 parallel + 1 single API creates in QA RT19 WF Dept B: all numbered within 5 s via records API without opening (#5679–#5689 contiguous); History: created, number, Closed. |
| NDC-3067 | PARTIAL | 400 audit events: user change lines show public IP (153/154). STILL: Recycle Bin purge ('permanently deleted') shows internal ::ffff:172.19.0.x on all 67 purge events; reproduced on #5686 (delete public, purge 172.19.0.36). Public IPs masked in evidence. |
| NDC-3064 | PASS | #5690: Edit form (all fields) saved priority+phone+contact together; Contact Info Change contact (→Contact 2) and Remove contact work (API confirmed). Contacts QA RT22 Contact 1/2 created. |
| NDC-3062 | PARTIAL | Form: tick→untick keeps 'This field is required', Save blocked (PASS). Server: POST layout_id Test Layout Rules + category technical with checkbox false or missing → 201 (FAIL). Tickets QA RT22 BS 3062 L created (3 + 4 on default layout). |
| NDC-3007 | BLOCKED | Needs a Help Center customer to post a Question (no customer sign-in saved). r19 found auto-ticket works (#4671, now deleted); open item was Post reply to forum + Forum Status. Topic test00 still shows ticket converted #4671 but the ticket is deleted (404). |
| NDC-3124 | PASS | #5704 API no contact + clone #5705 → sender ndc-staging-owner. INFO: #5526 (before fix) still Unknown sender; #5690 sender became contact added later. |
| NDC-3123 | PASS | Disable dialog: 'Its 12 tickets will move to the department you choose below.' (dept counts 12); 'kept' now only history/config. Cancelled, nothing disabled. |
| NDC-3121 | PASS | Dept-only PATCH on contract b5e0b71b → 422 SUPPORT_PLAN_OTHER_DEPARTMENT; stays Dept A + plan A; coverage plan A (correct). |
| NDC-3122 | PASS | Clone of #5706 (QA RT19 SLA Dept, owner not member, owned by Test User 1): form shows Test User 1, saved clone owned by Test User 1. |
| NDC-3104 | PENDING USER | Needs a customer email reply to an acknowledgement and a look at the customer inbox (no customer mailbox access). |
| NDC-3100 | PASS | Test User 1 Overview: EN Open/On Hold/Closed, AR مفتوحة/قيد الانتظار/مغلقة; no raw keys. Language restored to EN. |
| NDC-3099 | PASS | CES2 follows #5711 → owner moves to Sales → followers [] ; comment → no notification for CES2; CES2 404. |
| NDC-3097 | PASS | test user 2 (Desk Light Agent) added to QA RT20 B2 Dept for test: POST team with them 422 TEAM_LIGHT_AGENT; PUT add to team 422; full team 201 (team 'QA RT22 3097 full team' to delete). Dept restored. |
| NDC-3096 | PASS | CES2 had #5714 open; owner moved to Sales; within 10 s 'Ticket moved — ndc-staging-owner moved this ticket from Customer Support to Sales…' + Back to the list. |
| NDC-3095 | PASS | Classic View rows show department ▾; MOVE DEPARTMENT picker moved #5714 Sales → Customer Support (records API). |
| NDC-3091 | PASS | CES2 in DD + CS + DD team; reassign [DD→unassigned], update_rules true → memberships 1, team_sources 1; CS + skills kept. DD restored. |
| NDC-3027 | PASS | #5717 (contact) delete + restore: 'deleted/restored a Ticket named #5717 …', no EngineDeletedAt. INFO: 'added a Ticket' no name; 'Agent's action … agent.reassigned' raw; restore IP internal (3067). Imported ticket not checked. |
| NDC-3104 | PASS | User emailed from Gmail: #5738 new ack + 2 reply acks all 'Re: QA RT22 3104 ack test [#5738]'. INFO: Gmail sends single Re:; #5737 from agent address got no ack (agents not acknowledged). |
| NDC-3007 | PARTIAL | User posted HC Question → #5736 (forum, linked). Post reply to forum works (topic replies 0→1, 'Posted to the forum topic'). STILL: no Forum Status field on the ticket. |
| NDC-3133 | PASS | Run page table fits (1600: 1102/1102, 1280: 962/962), times full, Target Calls, Module Tickets. |
| NDC-3134 | PASS | Rule opens no toast, no ${contact_id} lookup; Contact Name/Department show placeholder + 'Filled in when the rule runs' + Change. INFO: text cut in narrow box. |
| NDC-3109 | PASS | XYZ 422 CURRENCY_CODE_INVALID; 12dp rate 422 TOO_PRECISE. |
| NDC-3108 | PASS | DELETE EUR used by deal 409 CURRENCY_IN_USE; deactivate allowed. |
| NDC-3106 | PASS | EUR added → Deal EUR 201 (rate 50, home 50000); Create Deal Currency lists EGP/EUR. INFO fields API still old allowed_values. |
| NDC-3107 | PASS | Create Deal: Amount E£, Currency + Exchange Rate (locked). |
| NDC-3101 | PASS | With EUR: Currency disabled + hint, API 409. Without: AED → home AED; reverted EGP. |
| NDC-3103 | PASS | Desk permission (QA RT18 profile toggled) + Tickets RecordVisibility now app=desk, absent from CRM feed. INFO: 17 entries from 17 Nov still in CRM. |
| NDC-3087 | PASS | QA RT22 GS 3087: Where-used panel 'Nothing uses this value'; delete confirm → 'Copper deleted'; no crash; API unused empty. In-use refusal not checked. |
| NDC-2807 | PASS | Mass update job 180/180 unattended, mass delete job 200/200, bin purge run 199/199; second runs 409; progress panel on return. INFO slow (~20-30/min); Empty Bin not run. 60 'QA RT22 2807 b' leads to clean. |
| NDC-3090 | PASS | Used In column 'Customers, Leads' links. |
| NDC-3089 | PASS | Used In › Leads lists Reports: QA RT19 GS Gold report, QA RT19 GS Sort report. |
| NDC-3088 | PASS | List + report sort follow set mode (entered Silver>Platinum>Bronze; alpha Bronze>Platinum>Silver); reverted entered. 3 leads QA RT22 3088 a/b/c. |
| NDC-2995 | PASS | Picker has Notes; repeated 'Leads (Lookup 2)' are 7 distinct fields with same label, now shown with field key. INFO: tenant has many same-label lookup test fields. Record page related lists not checked. |
| NDC-2137 | FAIL | Deals Kanban 20 loads p95 13.8 s median 7.6 s (target 2 s). |
| NDC-2136 | FAIL | All Deals p95 19.1 s median 7.5; All Leads (1,387) p95 31.3 s median 7.3 (target 1.5 s). Automation not run (owner sign-in). |
