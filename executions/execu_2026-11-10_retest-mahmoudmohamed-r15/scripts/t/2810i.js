const CM='6f553963-01d6-4b68-9fb3-143d23044c41';
let all=[]; for (let p=1;p<=20;p++){ const r=await api('GET','/modules/'+CM+'/records?page='+p+'&per_page=200'); const a=arr(r.j&&r.j.data); all=all.concat(a); if(a.length<200) break; }
const nameOf = x => { const o={}; (x.data||[]).forEach(d=>o[d.field]=d.value&&d.value.value); return [o.first_name,o.last_name,o.name,o.full_name].filter(Boolean).join(' '); };
const hits = all.filter(x=>/B04/.test(nameOf(x)));
const n = await api('GET','/notifications?apps=desk&page_size=5'); const ns = arr(n.j&&n.j.data).slice(0,5).map(x=>(x.title||'')+' — '+(x.body||x.message||'').slice(0,250)+' @'+(x.created_at||''));
return {crmContacts: all.length, b04: hits.map(x=>({id:x.id, name:nameOf(x)})), notifications: ns};
