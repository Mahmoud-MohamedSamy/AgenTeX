const o={};const RE=/QA RT(1[89]|2[0-3])/;const r=await api('GET','/salesiq/people/scoring/rules');const L=arr(r.j?.data?.items||r.j?.data);
for(const x of L.filter(x=>RE.test(x.name||''))){const d=await api('DELETE','/salesiq/people/scoring/rules/'+x.id);o[x.name]=d.s;}
o.left=arr((await api('GET','/salesiq/people/scoring/rules')).j?.data).filter(x=>RE.test(x.name||'')).length;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP omni scoring rules: '+JSON.stringify(o)+'\n');return o;
