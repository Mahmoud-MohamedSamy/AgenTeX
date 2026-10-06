// Finish C13 on QA MF Temp: inspect the no-Name record, delete all records, check recycle bin, delete module.
const temp = arr((await api('GET', '/modules')).j.data).find(m => m.pluralForm === 'QA MF Temp');
if (!temp) { rec('C13', 'BLOCKED', 'QA MF Temp not found'); return done(); }
const recs = arr((await api('GET', `/modules/${temp.id}/records?page_size=50`)).j.data);
const desc = recs.map(r => { const d = r.data || r.values || {}; const nm = Array.isArray(d) ? (d.find(x => x.field === 'name') || {}).value : d.name; return `${r.id.slice(0, 8)} name=${JSON.stringify(nm)}`; });
for (const r of recs) await api('DELETE', `/modules/${temp.id}/records/${r.id}`);
let rbInfo = '';
for (const q of ['?app_key=desk', '?app_key=desk&page=1&page_size=50', '?module_id=' + temp.id + '&app_key=desk']) { const rb = await api('GET', '/audit/recycle-bin/items' + q); rbInfo += ` [${q}: ${rb.s} ${rb.s === 200 ? 'contains QA MF rec: ' + /QA MF rec|qa_mf_temp|QA MF Temp/.test(rb.t) : rb.t.slice(0, 120)}]`; if (rb.s === 200) break; }
const d = await api('DELETE', `/modules/${temp.id}?cascade=true`);
const gone = !arr((await api('GET', '/modules')).j.data).some(m => m.id === temp.id);
rec('F9.detail', 'INFO', `records in QA MF Temp before cleanup: ${desc.join('; ')}`);
rec('C13', gone ? 'PASS' : 'FAIL', `after deleting all ${recs.length} records, DELETE module ?cascade=true → ${d.s} ${d.s >= 300 ? d.t.slice(0, 160) : ''}; module gone=${gone}; recycle bin:${rbInfo}`);
return done();
