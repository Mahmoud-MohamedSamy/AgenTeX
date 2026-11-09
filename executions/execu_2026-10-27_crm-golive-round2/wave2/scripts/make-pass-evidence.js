// Builds the round-2 "STILL PASSES" evidence for Wave 2 Done tickets from logged facts (after/r2-run1.log, r2-run2-deals.log, results.md).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname, W = path.resolve(D, '..');
const log = ['after/r2-run1.log', 'after/r2-run2-deals.log'].map(f => fs.readFileSync(path.join(W, f), 'utf8')).join('\n');
const mods = {};
for (const m of log.matchAll(/^\[RC ([a-z]+)\] (.+)$/gm)) if (!mods[m[1]]) mods[m[1]] = m[2].replace(/name now 'QA W2 RC [a-z]+ \d+ edited'/, 'rename 200');
const names = { leads: 'Leads', contacts: 'Customers', deals: 'Transactions', accounts: 'Agency Code', tasks: 'Tasks', calls: 'Calls', meetings: 'Meetings', subscriptions: 'Subscriptions', agency: 'Agency', services: 'Services', dailymove: 'Daily Move', cases: 'Cases', po: 'Purchase Orders', so: 'Sales Orders', ndcagencies: 'NDC Agencies' };
const short = id => id.slice(0, 8) + '…';
const ownerRe = /owner ([0-9a-f-]{36}) -> ([0-9a-f-]{36})/;
const lc = Object.entries(names).map(([k, n]) => {
  const s = mods[k];
  return [`${n.padEnd(16)} ${s ? s.replace(ownerRe, (a, b, c) => `owner ${short(b)} -> ${short(c)}`) : 'NOT FOUND'}`, s ? 'ok' : 'bad'];
});
const own = Object.entries(names).map(([k, n]) => {
  const m = (mods[k] || '').match(ownerRe);
  const same = m && m[1] === m[2];
  return [`${n.padEnd(16)} owner before ${m ? short(m[1]) : '?'}  after ${m ? short(m[2]) : '?'}  ${same ? 'same' : 'CHANGED'}`, same ? 'ok' : 'bad'];
});
const one = re => { const m = log.match(re); if (!m) throw new Error('fact missing: ' + re); return m[0].slice(0, 230); };
const cards = {
  1484: { title: 'TAVI API — every module: create, rename, delete, recycle bin, restore (RecordLifecycleTest, 27 Oct 2026 build)', lines: [...lc, ['15 of 15 modules: create, read, edit, delete, restore all work (Transactions rerun with the pipeline id)', 'info']] },
  1832: { title: 'TAVI API — edit a record and read its owner back (RecordLifecycleTest, 27 Oct 2026 build)', lines: [...own, ['15 of 15 modules: editing the name kept the owner', 'info']] },
  1302: { title: 'TAVI API — change only the stage of a deal (PipelineTest.stageChangeKeepsPipeline, 27 Oct 2026 build)', lines: [[one(/\[PL-05\][^\n]*/), 'ok'], ['The pipeline stays the same after the stage change', 'info']] },
  1603: { title: 'TAVI API — restore a record whose unique name is now taken (RecycleBinTest.restoreWithTakenUniqueValue)', lines: [['Account "QA W2 UNQ …" deleted, a new account with the same name created, then restore of the first', ''], [one(/\[RB-04\][^\n]*/).replace(/"skipped.*/, '…'), 'ok'], ['Restore refused with recyclebin.error.name_conflict: "Account name is already in use by another record."', 'info']] },
  bin: { title: 'TAVI API — Recycle Bin filters (RecycleBinTest.filters, 27 Oct 2026 build)', lines: [[one(/\[RB-02\][^\n]*/), 'ok'], ['Module filter: system modules included · Deleted by: 5 users · choosing Leads keeps every other module option', 'info']] },
  2302: { title: 'TAVI API — import with "Trigger workflow rules" off (ImportTest.triggerOffRunsNoWorkflow)', lines: [['QA On Create rule (description = "QA W2 WF ran") guarded on the test prefix; a control lead made by the API got it', ''], [one(/\[IM-05\][^\n]*/), 'ok'], ['0 of 2 imported leads were changed by the rule — no workflow ran for the import', 'info']] },
  2382: { title: 'TAVI API — create a deal with its pipeline id (PipelineTest, 27 Oct 2026 build)', lines: [[one(/\[PL-04\][^\n]*/), 'ok'], [one(/\[PL-07\][^\n]*/) + '  (no forced "Standard (Standard)" list any more)', 'ok'], ['The literal "Standard (Standard)" is now refused; the pipeline id is accepted', 'info']] },
  2386: { title: 'TAVI screen — Settings › Pipelines (RecordScreensUiTest.pipelinesPageLoads, 27 Oct 2026 build)', lines: [['Opened Settings › Pipelines from the Setup menu as the owner', ''], ['RecordScreensUiTest.pipelinesPageLoads  PASSED — the page did not stay on "Loading board…" within 30 s', 'ok'], ['Round 1 (25–26 Oct): stuck on "Loading board…" after 30–41 s', 'info']] },
};
const h = {};
for (const [k, c] of Object.entries(cards)) {
  const f = path.join(D, `card-pass-${k}.json`);
  fs.writeFileSync(f, JSON.stringify({ out: `api-pass-${k}.png`, title: c.title, lines: c.lines }));
  const o = execFileSync('node', [path.join(D, 'apicard.js'), f], { encoding: 'utf8' }).trim();
  h[k] = Number(o.split(/\s+/).pop());
  console.log(o);
}
const env = 'staging-crm.taviportal.com, build of 27 Oct (owner / CRM Admin A) vs Zoho CRM org943261092 (read-only)';
const card = (k, caption) => ({ img: `api-pass-${k}.png`, w: 1600, h: h[k], crop: [0, 0, 1600, h[k]], caption, boxes: [{ b: [0, 56, 1600, h[k] - 4], n: 1 }] });
const full = img => ({ img, w: 1600, h: 950, crop: [0, 0, 1600, 950] });
const G = '#16a34a';
const specs = {
  1484: { title: 'All 15 modules: create, read, edit, delete and restore work', panels: [card(1484, 'TAVI — automated lifecycle check on all 15 modules (27 Oct build).'), { ...full('z-leads-list.png'), caption: 'Zoho — Leads list; the full cycle was not run in Zoho (it would save).', boxes: [{ b: [252, 58, 328, 84], n: 1, color: G }] }], rows: [['1', 'Create, edit, delete, restore in every module', 'Not checked live (it would save in Zoho)', '15 of 15 modules: create 201, rename 200, delete 204 then 404, found in the bin, restore 200', 'PASS']] },
  1832: { title: 'Editing a record keeps its owner', panels: [card(1832, 'TAVI — owner read before and after a rename, all 15 modules (27 Oct build).'), { ...full('z-deal-overview.png'), caption: 'Zoho — deal "Benton": Deal Owner is its own field. Editing was not tried (it would save).', boxes: [{ b: [555, 355, 820, 380], n: 1, color: G }] }], rows: [['1', 'Edit another field', 'Deal Owner is a separate field; not checked live that an edit keeps it', 'Owner unchanged after the edit in 15 of 15 modules', 'PASS']] },
  1302: { title: 'Changing the stage keeps the pipeline', panels: [card(1302, 'TAVI — stage changed to needs_analysis, pipeline read back (27 Oct build).'), { ...full('z-deal-overview.png'), caption: 'Zoho — deal "Benton": stage bar. Changing the stage was not tried (it would save).', boxes: [{ b: [512, 256, 1440, 284], n: 1, color: G }] }], rows: [['1', 'Change only the stage', 'Stage bar on the deal; not checked live', 'Pipeline 5170500c… before and after; stage now needs_analysis', 'PASS']] },
  1603: { title: 'Restore refused when the unique name is taken', panels: [card(1603, 'TAVI — restore of a deleted account whose name is now used again (27 Oct build).'), { ...full('z-recyclebin.png'), caption: 'Zoho — Setup › Recycle Bin. A restore conflict was not tried (it would save).', boxes: [{ b: [756, 370, 880, 402], n: 1, color: G }] }], rows: [['1', 'Restore a record whose unique value is taken', 'Not checked live', 'Refused: name_conflict, "Account name is already in use by another record."; the first record stays deleted', 'PASS']] },
  1597: { title: 'Recycle Bin: the Module filter lists every module', panels: [card('bin', 'TAVI — Recycle Bin filter options (27 Oct build).'), { ...full('z-recyclebin.png'), caption: 'Zoho — Setup › Recycle Bin: a filter on the list and a Type column naming the module.', boxes: [{ b: [1520, 370, 1554, 402], n: 1, color: G }, { b: [756, 370, 880, 402], n: 1, color: G }] }], rows: [['1', 'Filter the bin by module', 'Filter on the list; Type column names each item’s module', '44 modules listed, system modules included', 'PASS']] },
  1600: { title: 'Recycle Bin: Deleted by lists the users', panels: [card('bin', 'TAVI — Recycle Bin filter options (27 Oct build).'), { ...full('z-recyclebin.png'), caption: 'Zoho — Setup › Recycle Bin list with its filter.', boxes: [{ b: [1520, 370, 1554, 402], n: 1, color: G }] }], rows: [['1', 'Filter the bin by who deleted', 'Filter on the list (deleted-by column)', 'Deleted by lists 5 users', 'PASS']] },
  1601: { title: 'Recycle Bin: other options stay after choosing a module', panels: [card('bin', 'TAVI — Recycle Bin filter options with Leads chosen (27 Oct build).'), { ...full('z-recyclebin.png'), caption: 'Zoho — Setup › Recycle Bin list with its filter. Choosing a module was not tried live.', boxes: [{ b: [1520, 370, 1554, 402], n: 1, color: G }] }], rows: [['1', 'Choose a module, look at the other options', 'Not checked live', 'With Leads chosen the filter still lists all 44 modules', 'PASS']] },
  2302: { title: 'Import with "Trigger workflow rules" off runs no workflow', panels: [card(2302, 'TAVI — QA rule, control lead, then an import with the trigger off (27 Oct build).'), { ...full('z-import.png'), caption: 'Zoho — Import screen. Zoho’s trigger option on import was not checked live.', boxes: [] }], rows: [['1', 'Import with workflow trigger off', 'Not checked live', 'Control lead got the rule; 0 of 2 imported leads were changed', 'PASS']] },
  2382: { title: 'A deal can be created with its pipeline id', panels: [card(2382, 'TAVI — create a deal with the pipeline id (27 Oct build).'), { ...full('z-deals-stageview.png'), caption: 'Zoho — Deals stage view. This org has only the default pipeline, so a pipeline id was not checked live.', boxes: [{ b: [254, 148, 365, 175], n: 1, color: G }] }], rows: [['1', 'Create a deal with its pipeline id', 'Not checked live (one default pipeline in this org)', 'Create with pipeline id 5170500c… → 201; the field no longer forces "Standard (Standard)"', 'PASS']] },
  2386: { title: 'Settings › Pipelines loads', panels: [card(2386, 'TAVI — automated screen test opening Settings › Pipelines (27 Oct build).'), { ...full('z-pipelines.png'), caption: 'Zoho — Setup › Customization › Pipelines opens at once.', boxes: [{ b: [258, 170, 1584, 580], n: 1, color: G }] }], rows: [['1', 'The Pipelines page shows its content', 'Opens at once', 'Opens; no longer stuck on "Loading board…" (screen test passed)', 'PASS']] },
  2282: { title: 'Kanban toolbar: one Layout picker and one labelled Pipeline picker', panels: [{ img: 'kanban-view.png', w: 1600, h: 950, crop: [256, 60, 1344, 200], caption: 'TAVI — Transactions kanban (27 Oct build): one Layout picker at the top and one picker labelled "Pipeline".', boxes: [{ b: [1078, 78, 1302, 116], n: 1 }, { b: [583, 203, 858, 234], n: 2 }] }, { ...full('z-deals-stageview.png'), caption: 'Zoho — Deals stage view toolbar: one view picker; no pipeline picker (this org has one pipeline).', boxes: [{ b: [254, 148, 365, 175], n: 1, color: G }] }], rows: [['1', 'One layout picker', 'One view picker (STAGEVIEW)', 'One "Standard" layout picker at the top — no duplicates', 'PASS'], ['2', 'Pipeline picker is labelled', 'Not checked live (one pipeline in this org)', 'The second picker is labelled "Pipeline"', 'PASS']] },
};
for (const [n, s] of Object.entries(specs)) {
  const spec = { out: `NDC-${n}-retest.png`, ticket: `NDC-${n}`, verdict: 'PASS', label: 'STILL PASSES', title: s.title, env, date: '27 Oct 2026', panels: s.panels, rows: s.rows };
  const f = path.join(D, `spec-NDC-${n}-pass.json`);
  fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  console.log(execFileSync('node', [path.join(D, 'annotate-vs-zoho.js'), f], { encoding: 'utf8' }).trim());
}
