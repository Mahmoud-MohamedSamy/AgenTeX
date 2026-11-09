# Wave 5 round 2 — after/ vs baseline/ (GET-only snapshot, scripts/snapshot.js; compared by scripts/diff.js)

Baseline taken 28 Oct 2026 ~07:20 UTC, after-snapshot ~09:25 UTC, both as CRM Admin A. All QA R2W5 objects were deleted (scripts/cleanup.js → after/cleanup.json) and the recycle bin holds no QA R2W5 / qa_r2w5 item (after/binchk.json).

| Item | Result |
|---|---|
| me | identical |
| modules | identical |
| teamspaces | identical |
| datatypes | identical |
| customDatatypes | identical |
| reports | identical |
| reportFolders | identical |
| dashboards | identical |
| homePages | identical |
| reportTz | identical |
| leadsLayouts | identical |
| leadsFieldCount | identical |
| leads buttons | identical |
| leads links | identical |
| leads validation-rules | identical |
| leads layout-rules | identical |
| leads dependency-maps | identical |
| customersLayouts | identical |
| customersFieldCount | identical |
| customers buttons | identical |
| customers links | identical |
| customers validation-rules | identical |
| customers layout-rules | identical |
| customers dependency-maps | identical |
| dealsLayouts | identical |
| dealsFieldCount | identical |
| deals buttons | identical |
| deals links | identical |
| deals validation-rules | identical |
| deals layout-rules | identical |
| deals dependency-maps | identical |
| company | differs: before {"exists":true,"id":"a98d2278-06a5-4423-b7f1-a93771cafe99","name":"Wonder Travel","alias":"Anyware","description":null,"website":"https://crm.taviportal.com/","phone":"01234567890","employee_count":null,"access_url":"https://crm.taviportal.com","logo / after {"exists":true,"id":"a98d2278-06a5-4423-b7f1-a93771cafe99","name":"Wonder Travel","alias":"Anyware","description":null,"website":"https://crm.taviportal.com/","phone":"01234567890","employee_count":null,"access_url":"https://crm.taviportal.com","logo |
| businessHours | identical |
| fiscalYear | identical |
| skills | identical |
| storage | identical |
| aiPolicy | identical |
| aiAgents | identical |
| apiClients | identical |
| webhooks | identical |
| translations | identical |
| binFirstPage | identical |

## The one difference (not made by this lane)
- company time_zone: Africa/Cairo (time_zone_version 1) → UTC (time_zone_version 0). updated_at did not change (27 Oct 08:39 UTC). This lane never wrote the company profile. In the same window the front end changed from index-De3hTVb3.js to index-clkSeMPm.js (seen 09:30 UTC), so a deployment probably reset it. Business hours still read 24×7, Africa/Cairo.

## Not in the snapshot but checked
- Modules list identical: QA R2W5 Module / Child / Dialog and every Java-made QA module are gone (Java cleanup lines in auto-run*.log all 204).
- Reports, dashboards, joined reports, schedules: none left (cleanup 204 each; report DELETE needs ?expected_revision).
- API clients: none left (QA R2W5 Client deleted 204 right after use; Java client deleted 204).
- Teamspaces: CRM Teamspace and New Teamspace only (QA R2W5 TS deleted 204).
- Blank Customers records from the Java NDC-1193 test: GET 404 and not in the bin.
