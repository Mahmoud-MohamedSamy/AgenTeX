# Zoho CRM <-> Zoho Desk integration: itemised inventory (from official Zoho docs)

Researched 18 Oct 2026, read-only (WebSearch/WebFetch plus a curl of the public Desk API doc). Items marked **[inferred]** are not stated outright in a doc; items marked **[community]** come from Zoho community threads, not the KB.

## Source key (cite as [Sx])
- S1 Desk KB: Integrating Zoho Desk with Zoho CRM. https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/sales-and-marketing/articles/integrating-zoho-desk-with-zoho-crm (same content as the older path https://help.zoho.com/portal/en/kb/desk/for-administrators/integrations-and-add-ons/articles/integrating-zoho-desk-with-zoho-crm)
- S2 Zoho One admin guide: Integrate Zoho CRM with Zoho Desk. https://help.zoho.com/portal/en/kb/one/admin-guide/integrations/zoho-crm/articles/integrate-zoho-crm-with-zoho-desk (same as https://help.zoho.com/portal/en/kb/one/admin-guide/unified-integrations/zoho-crm/articles/integrate-zoho-crm-with-zoho-desk)
- S3 CRM KB: Zoho Desk Integration. https://help.zoho.com/portal/en/kb/crm/integrations/zoho/zoho-desk/articles/zoho-desk-crm-integration (v2.1 copy: https://help.zoho.com/portal/en/kb/crm-v2-1/integrations/zoho/zoho-desk/articles/crm-v2-zoho-desk-crm-integration)
- S4 Desk FAQ: FAQs on Zoho Desk integration with Zoho CRM. https://help.zoho.com/portal/en/kb/desk/faqs/integration/articles/faqs-zoho-desk-integration-with-zoho-crm
- S5 CRM FAQ (NextGen): https://help.zoho.com/portal/en/kb/crm-nextgen/faqs/integration/articles/nextgen-zoho-crm-integration-zoho-desk (v2.1 copy: https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/crm-integrations/articles/crm-v2-exist-zoho-crm-integration-zoho-desk)
- S6 CRM troubleshooting: https://help.zoho.com/portal/en/kb/crm-v2-1/troubleshooting-tips/articles/crm-v2-troubleshooting-zoho-desk-integration-with-zoho-crm
- S7 Desk KB: Viewing Zoho CRM information inside tickets. https://help.zoho.com/portal/en/kb/desk/ticket-management/articles/viewing-zoho-crm-information-inside-tickets-new-ui (old UI: .../viewing-zoho-crm-information-inside-tickets)
- S8 Desk KB: Ticket work modes (Handshake). https://help.zoho.com/portal/en/kb/desk/ticket-management/articles/ticket-work-modes
- S9 Desk KB: Contact list views. https://help.zoho.com/portal/en/kb/desk/contacts-and-accounts/articles/predefined-and-custom-contact-views
- S10 Desk mobile (iOS) contact detail: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/contacts-and-accounts/articles/managing-the-contact-detail-page-in-ios
- S11 CRM Signals overview: https://help.zoho.com/portal/en/kb/crm/experience-center/salessignals/articles/signals-an-overview
- S12 Desk API reference: https://desk.zoho.com/DeskAPIDocument
- S13 Desk KB: Custom functions. https://help.zoho.com/portal/en/kb/desk/automation/actions/articles/creating-and-deploying-custom-functions
- S14 Deluge Desk tasks: https://www.zoho.com/deluge/help/desk-tasks.html ; CRM tasks: https://www.zoho.com/deluge/help/crm-tasks.html ; index: https://www.zoho.com/deluge/help/integration-tasks.html
- S15 CRM solution: Auto-create Desk tickets for deal stages. https://www.zoho.com/crm/resources/solutions/auto-create-zoho-desk-tickets-for-specific-deal-stages.html
- S16 Analytics Desk connector: https://www.zoho.com/analytics/help/connectors/zoho-desk.html ; Desk KB Analytics integration: https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/analytics-and-reports/articles/advanced-helpdesk-reports-with-zoho-analytics
- S17 Zoho staff community post: Sync products with associated contacts and accounts. https://help.zoho.com/portal/en/community/topic/sync-products-with-their-associated-contacts-and-accounts-across-crm-and-desk
- S18 Light agent actions FAQ (CRM Plus): https://help.zoho.com/portal/en/kb/crm-plus/faqs/desk/articles/what-actions-can-a-light-agent-perform-in-desk
- S19 Desk pricing: https://www.zoho.com/desk/pricing.html ; CRM feature availability: https://www.zoho.com/crm/help/feature-availability.html
- S20 CRM VoC FAQ: https://help.zoho.com/portal/en/kb/crm/zia-artificial-intelligence/voice-of-the-customer/voice-of-the-customer-an-overview/articles/voice-of-the-customer-frequently-asked-questions
- C1..C6 community threads (listed inline).

---

## 1. Setup and enablement

1. **Entry point (Desk side).** Setup > Integrations > Zoho > Zoho CRM > Integrate. Older docs and the FAQ say Setup > Marketplace > Zoho > Zoho CRM. [S1][S4]
2. **Desk-side prerequisites.** A paid Desk plan, a Desk Administrator, and a Zoho CRM administrator to authorise. [S1][S4]
3. **Path 1A (the Desk admin is also the CRM admin).** Pick the CRM company linked to your email from the dropdown, then Authorize. [S1]
4. **Path 1B (the Desk admin is not a CRM admin).** On the auth page choose "use another user's portal link", enter the CRM admin's email and request access. An invitation is sent and can be resent from the same page. The Configuration Details tab appears only after the CRM admin approves. [S1]
5. **Entry point (CRM side).** Setup > Marketplace > Zoho > Zoho Desk > Setup Now, then Get Started on the Desk homepage. [S3][S5]
6. **CRM-side wizard, 3 steps.** (1) Portal Configuration: choose the Desk portal. (2) Sync Configuration: sync direction, CRM related-list settings, product sync. (3) Users and Permissions: mutual users and ticket visibility. [S3]
7. **CRM side, no Desk account yet.** Enter a portal name and a Desk account (portal) is created. Then click Next and log in to Desk. [S3]
8. **CRM side, using another user's portal.** Use "Configure other user's portal": enter the portal admin's email and the **ZSC key**, then Next. [S3]
9. **CRM-side permission.** Users need the **"Zoho Desk Integration"** permission in their CRM profile. Only admins or admin-profile users can install the integration. [S3][S6]
10. **CRM edition.** All paid CRM editions. Free and trial editions are not supported. [S5]
11. **Desk edition.** Any paid Desk edition. Pricing places "work modes using CRM info" (Handshake) in Standard. [S4][S19]
12. **One portal.** Only one Desk portal can be linked to a CRM org. "Org already integrated" means the CRM org is mapped to another Desk org: delete that integration first. [S3][S6]
13. **Required CRM modules and fields.** The Accounts module must be enabled, and Contacts > Account Name must not be in Unused Fields, otherwise the integration fails. [S6]
14. **Disabled integrating user.** If the user was disabled during integration, their API key is disabled. Re-enable the user and retry. [S6]
15. **Dependency on the integrating admin.** If the admin whose login powers the integration leaves or becomes inactive, Desk prompts the other users to either update to an active user's details or deactivate and recreate the integration. [S3]
16. **Changing portal.** Removes ticket links on CRM Leads, Contacts and Accounts. The tickets stay in Desk. [S3]
17. **Completion email.** After setup, admins get an email with counts of added, updated and ignored records and the reasons records were skipped. [S4][S5]
18. **Org and department scope.** The integration is org/portal level. Product sync is scoped by selected Desk departments. Contacts and Accounts are org-wide in Desk. [S1][S3] [inferred for contacts/accounts being org-wide]

## 2. Sync configuration

19. **Modules synced.** CRM Accounts <-> Desk Accounts, CRM Contacts <-> Desk Contacts, CRM Products <-> Desk Products, including custom-field data. [S1][S4][S5]
20. **Not synced.** Leads, Deals/Potentials, Activities, Notes, Cases, Vendors and custom modules do not sync as records. Deals, Notes and Activities are shown live in Desk instead (see 3.x). [S4][S5] [inferred from the module list]
21. **Custom modules.** Cannot be selected during integration. CRM Enterprise/Ultimate customers can email support@zohocrm.com for a custom-function solution. [S4][S5]
22. **Direction for Contacts/Accounts.** Two-way sync is the default. One-way runs CRM -> Desk only, with CRM as the parent database. There is no Desk -> CRM one-way option. [S1][S5]
23. **Direction for Products.** Two-way or CRM -> Desk, configured separately via Configure next to Products. [S1]
24. **Switching one-way to two-way later.** Edit next to the module under Sync Settings > Two-way > Save. Records already synced are unaffected. Only records created or modified afterwards reflect the change. [S4][S5]
25. **Record scope filter.** Choose which CRM **list views (custom views)** of Accounts and Contacts sync to Desk. [S1]
26. **Product department scope.** Select the Desk departments whose products sync. [S1][S3]
27. **Product customer associations.** The option "Also sync the product's customer (contact and account) associations" requires two-way product sync AND two-way contact/account sync. Standard edition and above. [S1][S17]
28. **Match key for contacts.** Primary email by default. Optionally use the secondary email. [S1][S3]
29. **Secondary-email side effect.** When contacts are matched on secondary email, the Desk primary email is overwritten with the CRM primary email. The secondary email fields of the two systems are auto-mapped. [S1][S3]
30. **Duplicate check.** Contacts by email, Accounts by Account Name, Products by Product Name. [S1][S4][S5]
31. **Contacts without email.** Synced too. [S1]
32. **Field mapping.** Map Desk fields to CRM fields per module through dropdowns in the setup steps. It can be edited later via Configuration Details > Edit > Save. Custom fields are supported. [S1][S3]
33. **Field-type compatibility.** A type mismatch causes failures, e.g. "Text value is given for an Integer field". No supported-type matrix is published. [S1]
34. **Mandatory fields.** Mandatory CRM contact/account fields must be mapped or the sync fails ("Mandatory field missing"). [S1]
35. **Mapping changes are not retroactive.** Changing the mapped CRM field does not update records already synced. [S5]
36. **Initial sync.** A bulk import/export that may take several hours depending on volume. [S1][S4]
37. **Initial sync window.** Only records created or modified in the **last 1 year** are imported and synced. [S1]
38. **Ongoing sync frequency.** Event-driven and near-instant on create, update, delete and mass update in either system. No schedule, and no manual "sync now" is documented. [S1][S4][S5]
39. **Pause / resume.** Pause Sync stops all data exchange. Resume restarts it. Once activated, sync can only be paused, not switched off short of deactivating. The CRM path is Setup > Marketplace > Zoho > Zoho Desk > Manage > Sync Settings > Resume Sync. [S1][S3][S6]
40. **Delete preference, CRM record deleted.** (a) Always delete in Desk: the record and its associates go to the Desk recycle bin. (b) Delete in Desk only if it has no associates; otherwise only the mapping is removed. (c) Never delete in Desk: only the mapping is removed. [S1]
41. **Delete preference, Desk record deleted.** (a) Always delete in CRM: the record and associates go to the CRM recycle bin. (b) Never delete in CRM: only the mapping is removed. [S1]
42. **Associates definition.** Contacts: Tickets, Time Entries, Activities, Attachments. Accounts: Tickets, Contacts, Contracts, Attachments. Products: Attachments. [S1]
43. **Delete-preference path.** Setup > Integrations (or Marketplace) > Zoho > Zoho CRM > Configuration Details > Preferences, per module. [S1][S4][S6]
44. **Simplified delete rule in the CRM FAQ.** Two-way: a delete in either system deletes the counterpart. One-way: a CRM delete deletes in Desk, a Desk delete does not touch CRM. This conflicts with the configurable preferences above. Treat it as the default. [S5]
45. **Attachments and product tickets.** Product attachments and tickets linked to products are not synced. [S1]
46. **Sync History.** Setup > ... > Zoho CRM > Sync History. Last **7 days**: date, source -> target, record type (Contacts/Accounts), and added / updated / failed counts. [S1][S4]
47. **Failure Log.** Pick a record type to see failure time and reason, with **Try Again** per record. [S1][S4]
48. **Documented failure reasons.** "CRM ID already mapped with another Support Entity" (duplicate), text value for an integer field, mandatory field missing, missing parameter, incorrect API parameter or value. [S1]
49. **Lead -> contact conversion.** When a synced CRM lead is converted, the Desk contact mapping can stay pointing at the old lead ID. A Desk contact is not created as a CRM contact if the same person exists as a CRM Lead. [community C1: https://help.zoho.com/portal/es/community/topic/syncing-crm-lead-converted-to-contact ; C2: https://help.zoho.com/portal/en/community/topic/simple-way-to-add-support-contact-to-crm-leads-contacts-on-new-ticket]
50. **Desk-created contacts.** These are created in CRM when two-way sync is on. A Lead Source value such as "Zoho Desk" can be mapped to tag their origin. [community C2]

## 3. Desk-side surfaces

51. **CRM info in the ticket.** On Ticket Details, the CRM icon next to the customer info in the left pane shows CRM data for the Contact/Account: e.g. subscription type, open opportunities (potentials), and notes from contact owners. [S7]
52. **Navigation inside the CRM panel.** Account Name opens the account's CRM info. The Ticket Properties icon goes back. The View in CRM icon opens the record in CRM. [S7]
53. **Data categories shown.** Contact/Account information, Potentials (Deals), Notes, and Activities (Calls, Events, Tasks). [S1][S4][S12]
54. **Matching rule.** The ticket sender's email is matched to CRM contacts/accounts. The panel shows only if a match exists. [S4][S5]
55. **CRM info in contact/account detail.** The CRM customer profile appears within the Desk contact/account (CRM info tab). [S1][S4][S10]
56. **Standard contact views.** "Contacts Mapped with CRM" and "Contacts Unmapped with CRM". These are system views and not editable. [S4][S9]
57. **Account mapped/unmapped views.** Account-level equivalents are implied. [S9] [inferred]
58. **Mobile.** In the Desk iOS/Android app, a CRM info tab on the contact detail shows only when the contact is mapped to CRM. [S10]
59. **Handshake work mode.** Columns: Contacts/Leads (a lead or contact in CRM), Customers (one or more Won deals), Potentials (one or more Open deals), New (not in CRM). It needs the integration. Columns are system-defined and cannot be edited, renamed or deleted. Empty columns are hidden. Classification uses the CRM email or phone. [S8][S4]
60. **Handshake removed on delete.** Deleting the integration disables Handshake mode. [S1]
61. **CRM users -> Desk Light Agents.** On integration, CRM users are auto-added to Desk as Light Agents. They can be @mentioned in tickets and receive notifications via CRM Signals. [S1]
62. **@CRM Contact Owner mention.** Mentioning @CRM Contact Owner in a ticket comment notifies that contact's owner in CRM via Signals. [S1]
63. **Light Agent capabilities.** View tickets, accounts, contacts, articles, activities, reports and dashboards. Private comments only. Export. Private views. Automation/escalation alerts. [S18]
64. **Profile permission: Visible.** Setup > ... > Zoho CRM > Permissions tab. Uncheck Visible to hide the CRM integration from a profile. [S1][S4]
65. **Profile permission: Accounts/Contacts toggle.** Per profile, choose whether Accounts or Contacts CRM info is shown. [S1]
66. **Profile permission: Full vs Restricted Access.** Set separately for Contact/Account Info, Potentials, Notes, and Activities (Calls, Events and Tasks individually). Example: restrict Potentials for Light Agents. [S1]
67. **API flags for the same permissions.** 12 booleans under profile `permissions.crmInteg`: crmContactsInfo/Potentials/Notes/ActivityCalls/ActivityEvents/ActivityTasks, and the matching crmAccounts* flags. [S12]
68. **Creating CRM leads, deals or tasks from Desk.** No native action is documented. Zoho staff point to custom functions. A third-party "Ticket to Lead Converter" extension exists. [community C3: https://help.zoho.com/portal/en/community/topic/turn-ticket-into-zoho-crm-lead ; https://marketplace.zoho.com/app/desk/ticket-to-lead-converter-for-zoho-desk] [inferred: not native]
69. **Creating a CRM contact from Desk.** Indirect: create the contact in Desk and two-way sync pushes it to CRM. [S1][C2]
70. **Ticket for a CRM Lead.** The Desk ticket form looks up Desk contacts only. Entering a lead's email creates a new Desk contact. [community C4: https://help.zoho.com/portal/en/community/topic/ticket-for-a-lead]
71. **Pushing notes or activities to CRM.** Not documented. CRM Notes and Activities are view-only in Desk. [inferred from S1/S7]
72. **Deal details in Desk.** Only deal names are visible, with a click-through to CRM. There is no configurable deal-field card (an open feature request). [community C5: https://help.zoho.com/portal/en/community/topic/better-visibility-into-zoho-crm-potentials-within-zoho-desk]
73. **CRM fields in Desk criteria.** A "CRM Contact Type" criteria field (is / isn't: customer, potential, contact, lead) exists in SLA criteria, Direct Assignment Rules and Round Robin rules. [S12: GET /api/v1/sla/criteriaFields, /directAssignmentRules/criteriaFields, /roundRobinRules/criteriaFields]

## 4. CRM-side surfaces

74. **Zoho Desk related list.** Pre-mapped on Accounts, Contacts and Deals. Can be enabled on other modules (incl. Leads and custom modules) via the CRM Related Lists section > select modules > Save. [S3][S6]
75. **Related-list eligibility.** Only modules with an enabled email custom field are listed. [S3]
76. **Custom module related list missing.** Enable it at Settings > Marketplace > Zoho > Zoho Desk > Manage. [S6]
77. **Modules where tickets can show.** Leads, Contacts, Deals, Accounts, Products, Vendors, Cases (per the FAQ). [S5]
78. **Auto-linking.** Customer-raised tickets auto-link to the matching CRM record by sender email. The Refresh button next to Zoho Desk in the related list re-fetches. [S3][S5]
79. **Ticket visibility setting.** (1) tickets from all departments of the integrated user, or (2) only departments the CRM user belongs to. Set in Setup > Marketplace > Zoho > Zoho Desk. [S3][S5]
80. **"No ticket found" on a contact.** The ticket is in a department where the user is not active. Fix the department membership in Desk. [S6]
81. **Related-list filters.** Overdue, Closed, Escalated, High priority. No department filter, custom view, or rename. [S3][community C6: https://help.zoho.com/portal/en/community/topic/crm-desk-departments-and-related-lists]
82. **New ticket from CRM.** Record > Zoho Desk > New Ticket > Add Ticket popup: contact lookup or type a new name to create a contact, other fields, attachments, Submit. [S3]
83. **"+ New" missing.** Occurs when the CRM contact has no email. [S6]
84. **Reply / comment / forward from CRM.** Select a ticket > ticket icon > Desk window. [S3]
85. **Update ticket fields from CRM.** Update Field supports priority, status, owner, due date and other Desk fields. [S3]
86. **Close / delete from CRM.** Close in the top panel. Delete via More. [S3]
87. **Mutual-user requirement.** Creating or replying needs a user in both CRM and Desk. CRM-only users can view tickets, priority, due date and assignee, and can only comment. [S3][S4][S5]
88. **Link tickets to Deals.** Tick tickets in the related list > Link to Deals > choose a deal. Unlink via More > Unlink Tickets from Deal. The purpose is prioritising tickets tied to deals. [S3]
89. **Customer service statistics.** Zoho Desk section > Show Statistics: total tickets, overdue, average response time, average resolution time, customer ratings (overall and per ticket). [S3]
90. **Happiness ratings in CRM.** Shown in the statistics plus the "New Rating" Signal. The Desk API exposes customerHappiness good/ok/bad % on contacts and accounts. [S3][S11][S12]
91. **Signals for Desk events.** New Ticket, New Comment and New Response (from a lead, contact or potential), Ticket Overdue, Ticket Escalated, New Rating. Enable at Setup > Channels > SalesSignals (now Experience Center > Signals) > Desk. Users can reply, comment or update from the signal. [S3][S11]
92. **Desk tab in CRM.** A full Desk window inside CRM, only for users with a Desk account. Removed on delete. [S3]
93. **Desk module missing from CRM module list.** An intermittent issue. Create a dummy ticket via the related list to refresh. [S6]
94. **Invite CRM users to Desk.** Invite Users > select users. Users already in the portal appear as Mutual Users. Invitees get an activation email. Roles: Agent (reply, comment, forward), LightAgent (comment only), Admin (also assign). [S3]
95. **License use on invite.** Agent and Admin consume paid Desk agent licenses. Light agents are free up to the edition quota: Enterprise includes 50, Professional is paid per light agent. [S19] [inferred mapping]
96. **CRM dashboard / home component for tickets.** Not documented natively. Users have requested it. [community: https://help.zoho.com/portal/en/community/topic/zoho-crm-task-created-from-zoho-desk-ticket] [inferred: absent]
97. **CRM Voice of the Customer (Zia).** Uses Desk tickets (full message, feedback, rating, but not comments) as a VoC source, for Leads/Contacts only. Response types: Desk-ticket, Desk-reply, Desk-Rating. Enterprise and above, English only, 3-month retention. [S20]
98. **Client portal.** The CRM client portal and Desk help center are separate. A unified portal is "on the roadmap". [S4][S5]

## 5. Automation

99. **Desk custom functions (Deluge).** Triggered by workflow rules, blueprint transitions and schedules. The documented example is prioritising tickets using CRM sales data. [S13]
100. **Desk function limits.** 50,000 executions/day, 200,000 statements per function, 500,000 integration-task API calls/month, 2,500 emails/day. [S13]
101. **Deluge zoho.desk.* tasks (usable from CRM functions).** getRecords, getRecordById, create, update, searchRecords, getRelatedRecords, getRelatedRecordById, createRelatedRecord, updateRelatedRecord, ticket.move, ticket.split, ticket.merge. Each counts against the caller's external-calls limit. [S14]
102. **zoho.crm.* tasks from Desk functions.** Available via a connection (e.g. zoho.crm.getRecordById, updateRecord, searchRecords, v8 variants). [S14] [inferred: callable from Desk]
103. **CRM workflow -> Desk ticket (official solution).** A Deals workflow (Create/Edit, stage = Closed Won) runs a Deluge function that finds the Desk contact by email and creates a ticket. Enterprise and above, about 60 minutes to build. Connection scopes: ZohoCRM.modules.all, Desk.tickets.CREATE, Desk.settings.ALL, Desk.search.READ, Desk.contacts.ALL. Needs the Manage Extensibility, Manage Automation and Manage Sandbox permissions. [S15]
104. **CRM lead -> Desk ticket.** Zoho staff suggest a custom function on lead create. [C3] [community]
105. **Assignment by CRM contact owner.** Not available in Desk assignment rules (open community question). Only CRM Contact Type exists as a criterion (item 73). [community: https://help.zoho.com/portal/en/community/topic/desk-assign-to-crm-contact-owner][S12]
106. **CRM Contact Type in SLAs and round robin.** Lets you route or prioritise by customer, potential, contact or lead. [S12]
107. **Desk workflow criteria on CRM data.** Workflow criteria using CRM fields are not documented. Only the Contact Type field in SLA and assignment is evidenced. [inferred]
108. **Blueprint.** No CRM-specific blueprint feature. Only via custom functions on transitions. [S13] [inferred]
109. **Webhooks / Invoke URL.** Invoke URL calls are unlimited in Desk functions and can call the CRM REST API. [S13]
110. **Zia sentiment routing in Desk.** Not CRM-linked. CRM Zia VoC consumes Desk data (item 97). [S20]

## 6. Reporting

111. **In-CRM ticket statistics.** Per record (item 89). [S3]
112. **Zoho Analytics cross-app.** Add the Desk connector to the CRM Advanced Analytics workspace and enable auto-joins: Analytics "auto identifies columns and sets up joins (lookups)" between CRM and Desk tables. [S16]
113. **Analytics prerequisites.** Desk Professional or Enterprise, any paid Analytics plan, Desk admin only. One setup per portal. [S16]
114. **Analytics sync.** Every 1 h (Analytics Enterprise), every 3, 6 or 12 h (Standard+), or daily (Basic+). Sync Now up to 5 times/day. Synced Desk tables are read-only. No lookups between Desk tables. [S16]
115. **Native Desk reports with CRM fields.** Not documented. [inferred: none]

## 7. Deactivate, delete and reconfigure

116. **Pause (Desk).** No data exchanged until Resume. [S1]
117. **Delete from Desk.** More > Delete Integration > Delete. Sync stops, CRM info disappears from Desk, and Handshake mode is lost. Only Desk admins can delete. [S1][S3][S4]
118. **Deactivate from CRM.** Setup > Marketplace > Zoho > Zoho Desk > Deactivate > "I Understand. Deactivate now". This stops the integration in both systems. [S3][S5]
119. **Effects of deactivation in CRM.** Sync stops. Ticket info is no longer visible. Desk related lists are removed from record pages. **Deal-ticket links are permanently deleted.** All active syncs halt. The Desk tab is removed. [S3][S5]
120. **Synced data after deactivation.** Records already copied stay in both systems. Only the mappings and live views go. [inferred: no doc says records are deleted]
121. **Trial expiry or downgrade to Free (either side).** Sync pauses and cross-app views stop. Upgrading resumes. The CRM-side alert reads "CRM integration is not authorized for the portal" when the CRM edition lacks extensions or is Free. [S4][S5][S6]
122. **Re-integration fix.** Data breakage may need a migration and then re-integrating. Records missing after setup: re-integrate, then email support@zohodesk.com or support@zohocrm.com with the org email, ZUID and sample contact IDs so they can run a bulk fetch. [S4][S5][S6]
123. **Re-enable after delete.** In Zoho One, delete is irreversible and you must re-enable and reconfigure. Deactivate is reversible with Activate. [S2]

## 8. API

124. **Desk Contact object.** `zohoCRMContact {id, type}` is "Contact details fetched from Zoho CRM". type values: new, potentials, customers, contacts, leads (examples show "contacts_leads"). GET /api/v1/contacts, /contacts/{id}, /contacts/search. [S12]
125. **Desk Account object.** `zohoCRMAccount {id}` on GET /api/v1/accounts and the account endpoints. [S12]
126. **Setting the CRM link via API.** Writing zohoCRMContact or zohoCRMAccount reportedly has no effect. The link is managed only by the integration. [community: https://help.zoho.com/portal/vi/community/topic/linking-crm-contacts-and-accounts-to-desk-via-api]
127. **customerHappiness on contacts and accounts.** good/ok/bad percentage. [S12]
128. **Profile permissions API.** `permissions.crmInteg` with 12 flags (item 67). GET/PATCH /api/v1/profiles/{id}, GET /api/v1/myProfilePermissions. [S12]
129. **Criteria-field APIs exposing CRM Contact Type.** GET /api/v1/sla/criteriaFields, /api/v1/directAssignmentRules/criteriaFields, /api/v1/roundRobinRules/criteriaFields?departmentId=. The ticket table name is "CrmCase". [S12]
130. **Desk API limits.** Daily credits: Free 5,000; Express 25,000 + 100/user; Standard 50,000 + 250/user; Professional 75,000 + 500/user; Enterprise / Zoho One / CRM Plus 100,000 + 1,000/user. Light agents are excluded. Concurrency: 5 / 10 / 10 / 15 / 25. [S12]
131. **Integration config endpoints.** No public Desk or CRM API exists to configure the CRM integration (sync settings, mappings, delete preferences). [inferred: none found in S12]
132. **CRM API for Desk.** No Desk-specific CRM API. Use Deluge zoho.desk.* or Desk REST from CRM functions/extensions. A pattern: contacts/search?email= then /contacts/{id}/tickets. [S14][S15][community extension pointers: https://help.zoho.com/portal/en/community/topic/extension-pointers-for-integrating-zoho-crm-with-zoho-products-3-keep-track-of-your-zoho-desk-tickets-from-within-zoho-crm]
133. **CRM function budget.** Free: none. Standard/Professional: 5,000 + 200/user (add-on). Enterprise: 20,000 + 500/user. Ultimate: 20,000 + 1,000/user per 24 h. [S19 CRM feature availability]

## 9. Limits, edge cases and FAQs

134. Only one Desk portal per CRM org, and vice versa. [S3][S6]
135. The initial sync covers only the last 12 months of created or modified records. [S1]
136. Sync History is retained for 7 days only. [S1]
137. A ticket appears in CRM only if the sender email matches a CRM contact or account email. Phone is used for the Handshake classification. [S5][S8]
138. Departments: CRM users see tickets only from their active departments when visibility option 2 is set. [S5][S6]
139. Contacts without email sync, but cannot get "+ New" ticket from CRM. [S1][S6]
140. Mass updates trigger sync as well. [S1]
141. The secondary-email matching option overwrites the Desk primary email. [S1]
142. Mapping changes are not retroactive. [S5]
143. Deactivation permanently deletes deal-ticket links. [S5]
144. Custom CRM modules cannot sync. A related list is possible if the module has an email field. [S3][S5][S6]
145. Ticket-to-lead, ticket-to-task, and leads as ticket contacts are not native. [C3][C4] [community]
146. The CRM related list cannot be renamed, split or filtered by department. [C6] [community]
147. The admin-dependency: if the integrating admin is deactivated, the integration must be re-pointed. [S3][S6]
148. Docs are inconsistent between Setup > Integrations and Setup > Marketplace for the same Desk screens. The Failure Log path is written as Marketplace. [S1]

## 10. Zoho One admin-guide differences

149. **Enable from the Zoho One admin.** One Experience UI: Admin Panel > App Management > Integrations > Integrations tab > CRM > Available > Enable next to Desk. Spaces UI: the same steps from Directory Settings. Unified UI: Directory > Integrations > Integrations tab > app > Available > Enable. [S2]
150. **Pending Actions.** The integration activates only after configuration is complete. Incomplete setups are listed under Pending Actions. [S2]
151. **Deactivate vs Delete in Zoho One.** Kebab or action icon on the Active tab. Deactivate is reversible via Activate. Delete is irreversible and requires re-enable plus reconfigure. Sensitive actions need periodic re-authentication. [S2]
152. **Zoho One configure link.** The guide's "configure" link points to a Zoho Sprints/Meeting article, which looks like a doc bug. The actual configuration is the CRM-side wizard (S3). [S2]
153. **Zoho One / CRM Plus API credits.** Treated as Enterprise for Desk API credits and concurrency. [S12]
