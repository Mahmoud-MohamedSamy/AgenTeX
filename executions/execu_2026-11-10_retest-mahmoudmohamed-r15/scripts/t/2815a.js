const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('GET','/modules/'+T+'/layouts'); const ls = arr(r.j&&r.j.data);
const std = ls.find(x=>x.name==='Standard'); if(!std) return {s:r.s, names:ls.map(x=>x.name)};
const full = await api('GET','/modules/'+T+'/layouts/'+std.id);
fs.writeFileSync(RUN+'/out/2815-standard-layout-backup.json', full.t.length<3999 ? full.t : JSON.stringify(full.j));
const d = full.j.data; const views = d.views || d.layoutViews || d.definition;
const sum = {}; const vv = Array.isArray(views)?views:Object.entries(views||{}).map(([k,v])=>({kind:k,...v}));
for (const v of vv) { const secs = v.sections||[]; sum[v.kind||v.viewType||v.type||v.name] = {sections:secs.length, fields:secs.reduce((n,s)=>n+((s.fields||s.items||[]).length),0), names: secs.map(s=>(s.name||s.label||s.title)).join(' / '), hasResolution: JSON.stringify(v).includes('resolution')}; }
const ph = arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>(f.fieldName||f.apiName)==='phone');
return {id:std.id, keys:Object.keys(d), rowVersion:d.rowVersion||d.row_version||d.version, views:sum, phoneLabel: ph && ph.labels, phoneId: ph && ph.id};
