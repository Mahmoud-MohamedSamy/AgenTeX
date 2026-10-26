// Writes the API/log evidence cards for the round 4 Recycle Bin group (26 Oct 2026). Usage: node cards-r4-bin.js → cards/*.json, then apicard.js each.
const fs = require('fs'); const path = require('path');
const D = { date: '26 Oct 2026' };
const C = {
  'NDC-1597-search.png': { title: 'NDC-1597 · Recycle Bin › Filters › Module — search results and full list', rows: [
    ['full list', 'Filters › Module (no search), scroll to bottom', '40 modules with counts, formatted labels (Accounts, Contacts, Leads, Workflow Rule, Saved View, Org Unit, Profile, Approval Process, Blueprint …); no raw lowercase names', 'ok'],
    ['search "pipeline"', 'Module dropdown search box', '"No results found" — Pipeline not offered', 'bad'],
    ['search "review"', 'Module dropdown search box', '"No results found" — Review Process not offered', 'bad'],
    ['search "assignment"', 'Module dropdown search box', '"No results found" — Assignment Rule not offered', 'bad'],
    ['search "action"', 'Module dropdown search box', '"No results found" — Action not offered', 'bad'],
    ['odd entry', 'Module list, first option', '"23c1a6s8d46a (1)" — an id-like label instead of a module name', 'info']] },
  'NDC-1600-users.png': { title: 'NDC-1600 · Recycle Bin › Filters › Deleted by — users offered', rows: [
    ['users offered', 'Filters › Deleted by, scroll the full list', 'all 16 tenant users listed, each with a count', 'ok'],
    ['users with 0 items', 'e.g. Ahmed Hegazy NDC, Dev Team 2, Mahmoud Samy, test user 2', 'listed with (0) — selectable', 'ok'],
    ['users with items', 'e.g. ndc-staging-owner, test user 1', 'ndc-staging-owner (34) · test user 1 (1)', 'ok']] },
  'NDC-1797-api.png': { title: 'NDC-1797 / NDC-1795 · bulk Delete forever of 50 bin items', rows: [
    ['setup', '60 leads "QA RT 1795 bulk 01–60" created, then deleted', 'bin filter Starts with "QA RT 1795" → "60 items", 50 rows on page 1', 'info'],
    ['select all + Delete (50)', 'confirm "Permanently delete 50 records? This can\'t be undone." › Delete forever', 'dialog shown, action confirmed', 'info'],
    ['bulk delete', 'POST /recycle-bin/delete  ids = 50', '200 — all 50 succeeded, none left behind', 'ok'],
    ['auto refresh', 'GET /recycle-bin/items ×2 (fired by the page)', 'list re-fetched without a page refresh — shows the remaining 10 (bulk 01–10)', 'ok'],
    ['count after', 'bin filtered on "QA RT 1795"', '60 → 10 items (all 50 selected records gone)', 'ok']] },
  'NDC-1603-api.png': { title: 'NDC-1603 · restoring a record whose unique value is now taken', rows: [
    ['setup', 'unique field qa_rt_uniq (1ef504b5) on Leads layout "test"; lead "QA RT 1603 B" = QA-RT-U1', 'saved', 'info'],
    ['duplicate while live', 'create another lead with qa_rt_uniq = QA-RT-U1', '422 "QA RT Uniq is already in use by another record."', 'ok'],
    ['take the value', 'delete B; create "QA RT 1603 A" with QA-RT-U1', 'A saved — holds QA-RT-U1', 'info'],
    ['restore B', 'POST /recycle-bin/restore  (B)', '200 {succeeded: [], failed: [{reason_key: "recyclebin.error.name_conflict", detail: "QA RT Uniq is already in use by another record."}]}', 'ok'],
    ['UI result', 'toast + bin + Leads', 'toast "QA RT 1603 B: QA RT Uniq is already in use by another record."; B stays in the bin; only A holds QA-RT-U1', 'ok'],
    ['INFO', 'rename on restore', 'not offered — the conflicting record is skipped (ticket suggested rename or skip)', 'info']] },
  'NDC-1602-blocked.png': { title: 'NDC-1602 · Empty Bin on a large bin — not run', rows: [
    ['setup', '200 leads "QA RT 1602 fill 001–200" created, then deleted', 'bin filled to 244 items (200 fill leads + others)', 'info'],
    ['Empty Bin', 'Recycle Bin › Empty Bin › confirm', 'NOT clicked — refused by the agent\'s safety check (irreversible deletion of the whole bin)', 'bad'],
    ['result', 'POST empty / 504 check', 'not run — no response captured', 'info'],
    ['needs user', 'run Empty Bin manually (or allow it) and watch for 504 / "Working on it…" banner', 'the 200 QA RT fill items stay in the bin until cleanup', 'info']] },
};
fs.mkdirSync(path.join(__dirname, 'cards'), { recursive: true });
for (const [out, s] of Object.entries(C)) fs.writeFileSync(path.join(__dirname, 'cards', out.replace('.png', '.json')), JSON.stringify({ out, ...D, ...s }, null, 1));
console.log('wrote', Object.keys(C).join(', '));
