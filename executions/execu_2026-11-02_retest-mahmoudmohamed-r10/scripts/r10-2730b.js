const out={}; const L=await X.lead('o','QA RT r10 2730 AEX-01 b',{phone:'01099130163'}); const id=L.j?.data?.id; out.id=id; if(!id) return L.t.slice(0,300);
await sleep(8000); const h=await X.reviewHistory('o',T.LEADS,id); const rq=h?.cycles?.at(-1)?.requestId; out.rq=rq;
for(const fk of ['phone','email']) out['rv_'+fk]=(await api('o','POST',`/workflow/reviews/${rq}/fields/${fk}/approve`,{})).s;
let st; for(let i=0;i<15;i++){ await sleep(3000); st=(await X.approvalState('o',T.LEADS,id)).j?.data; if(st?.instanceId) break; } out.appr=st?.state;
if(st?.instanceId) { const a=await api('o','POST',`/workflow/approvals/${st.instanceId}/approve`,{comment:'QA RT r10'}); out.approve=a.s+' '+(a.s>299?a.t.slice(0,200):''); }
await X.waitFor(45, async()=> ((await X.bpState('o',T.LEADS,id))?.transitions||[]).length>0);
out.bp=((await X.bpState('o',T.LEADS,id))?.transitions||[]).map(t=>t.name||t.transitionId);
out.source=await X.field('o',T.LEADS,id,'lead_source'); return out;
