// Writes the API/fact cards for the Wave 2 retest images, from logged facts only (after/auto-run3.log, auto-ui2.log,
// results.md of the 25-26 Oct manual run). Then: for f in card-r-*.json; do node apicard.js $f; done
const fs = require('fs');
const cards = {
  '1302': ['api-1302-stage-keeps-pipeline.png', 'TAVI API — change only the stage of a deal (PipelineTest.stageChangeKeepsPipeline, 26 Oct 2026, run 3)', [
    ['QA deal created in pipeline 5170500c… ("Standard"), stage qualification', 'info'],
    ['PATCH stage = needs_analysis -> 200', 'ok'],
    ['GET: stage needs_analysis, pipeline 5170500c… (unchanged)', 'ok'],
    ['Screen, 25 Oct: stage bar click -> PATCH 200, pipeline stays Standard; Stage History "qualification -> needs_analysis"', 'ok']]],
  '1216': ['api-1216-mass-delete.png', 'TAVI — mass delete by criteria (manual run, 25 Oct 2026, case MD-02)', [
    ['120 QA leads seeded: "QA W2 MD 001" … "QA W2 MD 120"', 'info'],
    ['Criteria: Full Name starts with "QA W2 MD" -> preview "Total Records: 120"', 'ok'],
    ['Page select 50 -> "select all" 120 -> "Delete 120 Leads?" + type DELETE', 'ok'],
    ['Result: "120 Leads deleted" + View in Recycle Bin; matched 120, deleted 120, failed 0', 'ok'],
    ['No other lead was deleted (one deletion group, all 120 found in the bin and purged afterwards)', 'ok']]],
  '1795': ['api-1795-bin-refill.png', 'TAVI — delete forever in the Recycle Bin (manual run, 25 Oct 2026, case RB-05)', [
    ['120 QA items in the bin; select the page (50) -> Delete -> "Permanently delete 50 records?"', 'info'],
    ['"50 items permanently deleted" -> the list refills with the next 50 by itself (no Load More needed)', 'ok'],
    ['50 + 50 + 20 deleted -> 0 QA items left', 'ok']]],
  '1603': ['api-1603-restore-conflict.png', 'TAVI API — restore an account whose unique name is now taken (RecycleBinTest, 26 Oct 2026, run 3)', [
    ['Account "QA W2 UNQ …" created -> deleted -> a second account with the same name created', 'info'],
    ['POST /audit/recycle-bin/restore -> 200 {succeeded: [], failed: [{reason_key: "recyclebin.error.name_conflict",', 'ok'],
    ['   detail: "Account name is already in use by another record."}]}', 'ok'],
    ['The first account stays deleted (GET -> 404); the screen shows the same message (25 Oct)', 'ok']]],
  '1602': ['api-1602-empty-bin.png', 'TAVI — Empty Bin from the Recycle Bin screen (manual run, 25 Oct 2026, case RB-06, run on the user\'s order)', [
    ['Empty Bin confirmed -> finished in about 248 s, no 504 / timeout', 'ok'],
    ['3,080 items -> 1,217 (CRM screen scope; 1,071 Desk items are outside it, by design)', 'ok'],
    ['16 items of deleted modules stay (NDC-1797)', 'info'],
    ['Not repeated on 26 Oct: it empties the whole tenant\'s bin', 'info']]],
  '1797': ['api-1797-orphans.png', 'TAVI — Recycle Bin items of deleted modules (RecycleBinTest 26 Oct 2026 run 3 + manual 25 Oct)', [
    ['16 CRM bin items belong to modules that no longer exist: 23c1a6s8d46a, test, partners, testmodule', 'bad'],
    ['Delete forever as the Owner -> recyclebin.error.forbidden', 'bad'],
    ['Restore as the Owner -> recyclebin.error.forbidden', 'bad'],
    ['Empty Bin leaves them; they can only expire after 60 days', 'bad'],
    ['26 Oct: the one-time delete test (-Dw2.purgeOrphan=true) was not run (blocked by the permission check)', 'info']]],
  '1599': ['api-1599-import-fp.png', 'TAVI — import as test user 1 with Company read-only and Email hidden (ImportTest 26 Oct run 3 + manual 25 Oct)', [
    ['QA profile: Company = read only, Email = hidden; test user 1 moved to it (and back to User / Sales after)', 'info'],
    ['Screen: mapping shows "Company (read-only for your profile)" disabled; Email is not offered', 'ok'],
    ['API replay with company + email: validate says "This field is read-only / hidden for your profile,', 'ok'],
    ['   so you cannot import values into it"', 'ok'],
    ['Execute -> 0 created, errors 1 (26 Oct) / 2 (25 Oct); control import of a plain lead -> 1 created', 'ok'],
    ['Minor: the session status says "partially_completed" although nothing was created', 'info']]],
  '1554': ['api-1554-tag-delimiter.png', 'TAVI — import mapping step, Leads (manual run, 25 Oct 2026, case IM-03)', [
    ['CSV of 6 rows uploaded -> mapping: auto-mapped 3 of 4 columns; Default tags offered', 'ok'],
    ['Tag delimiter shown as static helper text ", ;" — no picklist', 'ok'],
    ['Tags column imported into the records (IM-07)', 'ok']]],
  '2122': ['api-2122-upper-and.png', 'TAVI API — custom view criteria pattern (CustomViewTest, 26 Oct 2026, run 3)', [
    ['pattern "1 and 3" (condition 3 does not exist) -> 422 INVALID_VIEW', 'ok'],
    ['pattern "1 and 2" -> 201 (control)', 'ok'],
    ['pattern "1 AND 2" (upper case) -> 201   <- still accepted', 'bad']]],
  '2098': ['api-2098-deleted-view-url.png', 'TAVI — open Leads with ?view=<deleted view id> (manual run, 25 Oct 2026, case CV-04)', [
    ['View "QA W2 CV main renamed" opened, then deleted', 'info'],
    ['/modules/{leads}?view=<that id> -> the page opens the last-used view again ("QA W2 CV main renamed", 2 records)', 'bad'],
    ['Expected: the default All Leads view', 'info'],
    ['26 Oct: the automated screen test could not run (browser timeout, then the machine ran out of memory)', 'info']]],
  '2136': ['api-2136-list-speed.png', 'TAVI — Leads list, time to first rows (RecordScreensUiTest.leadsListSpeed, 26 Oct 2026)', [
    ['Warm-up load, then 3 timed loads of /modules/{leads} (Standard layout, 171 records)', 'info'],
    ['load 1: 15.5 s   load 2: 11.8 s   load 3: 16.2 s   (best 11.8 s)', 'bad'],
    ['Target 1.5 s. Manual run 25 Oct: 13.4–25.5 s; the ticket said 9.1 s', 'bad']]],
  '2137': ['api-2137-kanban-speed.png', 'TAVI — Transactions kanban, time to first cards (manual run, 25 Oct 2026, case KB-04)', [
    ['3 reloads: column headers after 2.4 / 2.4 / 3.4 s', 'info'],
    ['first Qualification cards after 3.0 / 4.5 / 4.2 s', 'bad'],
    ['Target 2 s; the ticket said 5.1 s — better, not there yet', 'bad']]],
};
for (const [t, [out, title, lines]] of Object.entries(cards)) fs.writeFileSync(`card-r-${t}.json`, JSON.stringify({ out, title, lines }, null, 1));
console.log(Object.keys(cards).length, 'cards');
