const out={}; const DL='243becce-8310-4236-b056-0ebb4731b205';
const L=await X.lead('o','QA RT r10 2727 lead',{}); const id=L.j?.data?.id; out.lead=id;
const made=[]; for(let i=1;i<=12;i++){ const r=await api('o','POST',`/modules/${T.DEALS}/records`,{layout_id:DL,data:rec({deal_name:'QA RT r10 2727 deal '+String(i).padStart(2,'0'),stage:'qualification',lead:id})}); if(r.s<300){ made.push(r.j.data.id); ledger(`deal ${r.j.data.id} "QA RT r10 2727 deal ${i}"`);} else out.err=r.t.slice(0,300); }
out.deals=made.length;
const rl=await api('o','GET',`/modules/${T.LEADS}/records/${id}/related-lists`); out.related=rl.s+' '+rl.t.slice(0,600);
return out;
