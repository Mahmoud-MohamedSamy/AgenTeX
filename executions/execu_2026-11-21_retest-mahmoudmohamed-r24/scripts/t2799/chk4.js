const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const r=await api('GET','/modules/'+TK+'/records?page=1&per_page=12&sort_by=created_at&sort_dir=desc');
const v=x=>x&&typeof x==='object'?(x.value??x.label??x.display??JSON.stringify(x).slice(0,40)):x;
return arr(r.j?.data).map(x=>{const d=x.data||x.values||x;const g=f=>v(Array.isArray(d)?(d.find(y=>y.field===f)||{}).value:d[f]);return [x.created_at,g('ticket_number')||g('number'),String(g('subject')||'').slice(0,60),g('channel'),g('status')]});
