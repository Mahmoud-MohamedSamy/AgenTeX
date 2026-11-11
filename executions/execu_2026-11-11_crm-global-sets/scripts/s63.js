const run=async(id)=>{const q=await api('POST','/reporting/reports/'+id+'/query',{}); const d=q.j&&q.j.data&&(q.j.data.data||q.j.data); return JSON.stringify(d&&d.rows)+' meta '+JSON.stringify(d&&d.meta).slice(0,160);};
const o={}; o.goldNow=await run(I.REP);
const p=await api('PATCH','/modules/'+L+'/records/'+I.RR[0],rec({qa_gs1111_rep:'Bronze'})); o.patch=SR(p); await sleep(15000);
o.goldAfterEdit=await run(I.REP); o.allAfterEdit=await run(I.REP2);
return o;
