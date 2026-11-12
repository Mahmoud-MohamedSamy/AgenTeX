const out = {}; const mods = arr((await api('GET', '/modules')).j.data); out.mods = mods.map(m => m.moduleKey).join(' ');
const Q = /QA LR1112|qa_lr/i;
for (const m of mods) {
  const o = {};
  const r = arr((await api('GET', '/modules/' + m.id + '/layout-rules')).j.data); if (r.length) o.rules = r.map(x => x.name);
  const l = arr((await api('GET', '/modules/' + m.id + '/layouts')).j.data).filter(x => Q.test(x.name)); if (l.length) o.layouts = l.map(x => x.id.slice(0, 8) + ' ' + x.name);
  const f = arr((await api('GET', '/modules/' + m.id + '/fields')).j.data).filter(x => Q.test(x.fieldName)); if (f.length) o.fields = f.length;
  for (const k of ['buttons', 'links', 'dependency-maps', 'validation-rules', 'blueprints']) { const x = await api('GET', '/modules/' + m.id + '/' + k); const a = arr(x.j && x.j.data).filter(y => Q.test(JSON.stringify(y))); if (a.length) o[k] = a.map(y => y.id.slice(0, 8)); }
  const w = arr((await api('GET', '/workflow/rules?module_id=' + m.id)).j.data).filter(y => Q.test(y.name)); if (w.length) o.wf = w.map(y => y.id.slice(0, 8));
  const rr = await api('GET', '/modules/' + m.id + '/records?q=' + encodeURIComponent('QA LR1112') + '&per_page=100'); const ra = arr(rr.j && rr.j.data).filter(y => JSON.stringify(y).includes('QA LR1112')); if (ra.length) o.recs = ra.length;
  if (Object.keys(o).length) out[m.moduleKey] = o;
}
const fp = await api('GET', '/modules/' + I.mod_leads + '/field-permissions'); out.fps = arr(fp.j && fp.j.data).filter(x => (I.fps || []).includes(x.id)).length;
return out;
