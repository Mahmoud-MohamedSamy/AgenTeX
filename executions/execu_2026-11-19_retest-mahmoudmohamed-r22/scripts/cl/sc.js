const RE=/QA RT(1[89]|2[0-3])|Copy of QA RT(1[89]|2[0-3])/;const o={};const r=await api('GET','/scoring-rules?take=500');const d=r.j?.data;const L=Array.isArray(d)?d:(d?.rules||d?.items||[]);o.list=r.s+' n='+L.length;
const qa=L.filter(x=>RE.test(x.name||''));o.qa=qa.map(x=>x.name);for(const x of qa){const del=await api('DELETE','/scoring-rules/'+x.id);o['del '+x.name]=del.s+(del.s>=300?' '+String(del.t).slice(60,160):'');}
const ps=arr((await api('GET','/iam/profiles?take=500')).j?.data).filter(x=>/^QA RT(1[89]|2[0-3])/.test(x.name));o.profilesLeft=ps.map(x=>x.name);
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP crm scoring rules: '+JSON.stringify(o).slice(0,500)+'\n');return o;
