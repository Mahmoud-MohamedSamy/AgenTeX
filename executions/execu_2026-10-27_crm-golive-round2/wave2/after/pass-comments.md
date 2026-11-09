# Round 2 Wave 2 — "still passes" comments (drafts, not posted)

## NDC-1484
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>In all 15 modules a QA record was created (201), renamed (200), deleted (204, then 404), found in the recycle bin and restored (200).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner and CRM Admin A; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1484-retest.png</p>

## NDC-1832
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>Editing a record's name kept its owner in all 15 modules (owner read back before and after each edit).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner and CRM Admin A; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1832-retest.png</p>

## NDC-1302
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>Changing only a deal's stage (to needs_analysis) kept its pipeline (5170500c… before and after).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1302-retest.png</p>

## NDC-1603
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>Restoring a deleted account whose name is now used by another account is refused with "Account name is already in use by another record." (name_conflict), and the first account stays deleted.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1603-retest.png</p>

## NDC-1597
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>The Recycle Bin module filter lists 44 modules, system modules included.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1597-retest.png</p>

## NDC-1600
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>The Recycle Bin "Deleted by" filter lists the users who deleted items (5 users).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1600-retest.png</p>

## NDC-1601
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>After choosing Leads in the Recycle Bin module filter, the filter still lists all 44 modules.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1601-retest.png</p>

## NDC-2302
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>With a QA On Create rule active, a control lead created by the API got the rule, while 2 leads imported with "Trigger workflow rules" off were not changed (0 of 2 after 60 seconds).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2302-retest.png</p>

## NDC-2382
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>A deal is created with its layout's pipeline id (201), and the Pipeline field no longer forces the text "Standard (Standard)".</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2382-retest.png</p>

## NDC-2386
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>Settings › Pipelines opens from the Setup menu and no longer stays on "Loading board…" (automated screen test passed).</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2386-retest.png</p>

## NDC-2282
<p><strong>Retest 27 Oct 2026 — still passes on the new build</strong></p><p>The Transactions kanban has one Layout picker at the top and one picker labelled "Pipeline", with no duplicate unlabelled pickers.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2282-retest.png</p>
