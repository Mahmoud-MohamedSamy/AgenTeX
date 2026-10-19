// Cleanup step 9 (owner): purge the two test-user views from the bin, then verify nothing "QA RT" remains.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const base = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200';
const list = async () => { let all = [], cur = null; for (let p = 0; p < 20; p++) { const r = await api('GET', '/audit/recycle-bin/items?' + base + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j && r.j.data); all = all.concat(it); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !it.length) break; } return all; };
const out = {}; let qa = (await list()).filter(x => /^QA RT /.test(x.record_label || '')); out.binBefore = qa.map(x => x.record_label);
if (qa.length) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(x => x.id) }); out.purge = r.s; }
await sleep(3000); out.binAfter = (await list()).filter(x => /^QA RT /.test(x.record_label || '')).length;
for (const [k, m] of [['leadsViews', L], ['dealsViews', D]]) { const v = await api('GET', '/modules/' + m + '/views?kind=list'); out[k] = arr(v.j && v.j.data && (v.j.data.views || v.j.data)).filter(x => /^QA RT/.test(x.name)).length; }
for (const [k, m] of [['leadsRecords', L], ['dealsRecords', D]]) { const s = await api('GET', '/modules/' + m + '/records?page=1&per_page=50&search=' + encodeURIComponent('QA RT')); out[k] = arr(s.j && s.j.data).filter(r => /QA RT/.test(JSON.stringify(r.data))).length; }
const ap = await api('GET', '/workflow/approval-processes'); out.approvalProcesses = arr(ap.j && ap.j.data).filter(x => /QA RT/.test(x.name)).length;
const lp = await api('GET', '/modules/' + L + '/list-preferences'); out.ownerLeadsOverrides = Object.keys(lp.j.data.prefs.viewColumns || {}).length;
const tp = await api('GET', '/modules/' + T + '/list-preferences'); out.tasksFilter = JSON.stringify(tp.j.data.prefs.workqueueFilters);
const tz = await api('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.company.locale.timezone', scope_type: 'Org' }] }); out.timezone = (tz.t.match(/Africa\/Cairo|UTC/) || ['?'])[0];
return done(out);
