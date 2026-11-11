// summary of Standard layout views (sections, fields, detail-only fields)
const T='88e8ea44-1658-4df3-9930-d0902b91073d', L='1b55c25d-eb27-4046-afd1-b292398b435b';
const fl = arr((await api('GET','/modules/'+T+'/fields')).j.data); const nm = {}; fl.forEach(f=>nm[f.id]=f.fieldName);
const d = (await api('GET','/modules/'+T+'/layouts/'+L)).j.data; d.views = Array.isArray(d.views)?d.views:Object.entries(d.views).map(([k,x])=>({kind:k,...x}));
const sum = {rowVersion:d.rowVersion};
const fieldsOf = v => { const out=[]; for (const s of (v.layout.sections||[])) for (const c of (s.columns||[])) for (const f of (c.fields||[])) out.push(nm[f.field_id||f.fieldId||f.id]||f.field_key||f.key||f.id); return out; };
for (const v of d.views) { sum[v.kind] = {rowVersion:v.rowVersion, updatedAt:v.updatedAt, sections:(v.layout.sections||[]).map(s=>(s.label&&(s.label.en||s.label.default))), fieldCount: fieldsOf(v).length}; }
const cr = new Set(fieldsOf(d.views.find(v=>v.kind==='CREATE'))); sum.detailOnly = fieldsOf(d.views.find(v=>v.kind==='DETAIL')).filter(x=>!cr.has(x));
const ph = fl.find(f=>f.fieldName==='phone'); sum.phoneLabel = ph.labels;
return sum;
