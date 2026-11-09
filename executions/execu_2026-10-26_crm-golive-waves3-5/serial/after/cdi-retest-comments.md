# CRM ⇄ Desk retest comments (posted 27 Oct 2026)

## NDC-2393
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>Unlinking a record answers 204, and a later CRM edit does not re-link it. Linking by hand works again (201).</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-01).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2393-retest.png</p>

## NDC-2395
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>New Failure Log rows name the records involved instead of raw ids. 6 of 21 older rows, written before the fix, still show raw ids; they are not rewritten.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-03).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2395-retest.png</p>

## NDC-2396
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>7 invalid field-mapping bodies were all refused (422 or 400) and none was stored.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-04).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2396-retest.png</p>

## NDC-2397
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>Saving the integration settings without a row version answers 400, and with an old row version answers 409, so a second tab can no longer overwrite newer settings.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-05).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2397-retest.png</p>

## NDC-2398
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>Sync history rows now carry the failed count (for example: accounts added 4, failed 5).</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-06).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2398-retest.png</p>

## NDC-2401
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>A 1,206-character pause reason is refused with 400 "at most 500 characters".</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-09).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2401-retest.png</p>

## NDC-2402
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>Random and deleted ids answer 404 instead of a server error.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-10).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2402-retest.png</p>

## NDC-2405
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>When the delete preference changes after a delete was queued, the Desk contact is kept.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-13).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2405-retest.png</p>

## NDC-2409
<p><strong>Retest 27 Oct 2026 — passes</strong></p><p>Changes to the integration settings now appear in the Audit Log, with the owner as the actor. Moved from Bug to Done.</p><p>Environment: staging-crm.taviportal.com, new build of 27 Oct, owner account; automated test crmdeskintegration (case CD-17).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2409-retest.png</p>
