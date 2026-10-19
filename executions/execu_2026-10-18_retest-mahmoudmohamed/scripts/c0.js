// Cleanup step 0 (read-only): inventory of everything this round created on staging-crm.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const out = {};
const nm = (r, f) => ((r.data || []).find(x => x.field === f) || { value: {} }).value.value;
for (const [k, m] of [['leads', L], ['deals', D]]) {
  const v = await api('GET', '/modules/' + m + '/views?kind=list'); const vl = arr(v.j && v.j.data && (v.j.data.views || v.j.data)).filter(x => /^QA RT/.test(x.name));
  out[k + 'Views'] = { n: vl.length, sample: vl.slice(0, 4).map(x => x.name + '|' + x.id + '|' + x.owner_user_id + '|' + x.visibility) };
  const s = await api('GET', '/modules/' + m + '/records?page=1&per_page=50&search=' + encodeURIComponent('QA RT')); out[k + 'SearchStatus'] = s.s;
  out[k + 'Records'] = arr(s.j && s.j.data).map(r => (nm(r, 'first_name') || nm(r, 'name') || nm(r, 'deal_name') || '?') + '|' + r.id).filter(x => /QA RT/.test(x));
}
const rb = await api('GET', '/audit/recycle-bin/items?app_key=crm&page=1&per_page=50'); out.bin = rb.s + ' ' + JSON.stringify(arr(rb.j && rb.j.data).filter(x => /QA RT/.test(JSON.stringify(x))).map(x => JSON.stringify(x).slice(0, 300)));
const ap = await api('GET', '/workflow/approval-processes'); out.ap = arr(ap.j && ap.j.data).filter(x => /QA RT/.test(x.name)).map(x => x.name + '|' + x.id + '|' + (x.status || x.is_active));
const lp = await api('GET', '/modules/' + L + '/list-preferences'); out.leadsPrefs = lp.s + ' viewColumns keys=' + Object.keys((lp.j && lp.j.data && (lp.j.data.prefs || lp.j.data).viewColumns) || {}).length + ' rv=' + JSON.stringify(lp.j && lp.j.data && (lp.j.data.row_version ?? lp.j.data.rowVersion)) + ' top=' + Object.keys((lp.j && lp.j.data) || {}).join(',');
const tp = await api('GET', '/modules/' + T + '/list-preferences'); out.tasksPrefs = tp.s + ' ' + tp.t.slice(0, 500);
return done(out);
