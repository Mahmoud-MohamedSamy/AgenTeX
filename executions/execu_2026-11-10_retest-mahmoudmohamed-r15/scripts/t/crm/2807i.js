const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
const cnt={}; let total=0; let cursor=null;
for (let p=1;p<=10;p++){ const r = await api('GET','/modules/'+L+'/records?page='+p+'&per_page=100&view_id='+V); const rows = arr(r.j&&r.j.data); if(!rows.length) break; for (const x of rows){ total++; const f=(x.data||[]).find(d=>d.field==='lead_source'); const v = f&&f.value&&f.value.value!==undefined? f.value.value : (f&&f.value&&f.value.kind)||'none'; cnt[v]=(cnt[v]||0)+1; } }
return { total, lead_source: cnt };
