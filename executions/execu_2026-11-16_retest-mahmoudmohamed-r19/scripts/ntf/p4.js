const R={};
for(const id of ['f2219c2f-0f2b-4c8b-9ff5-0846b858f1d9','1537c932-2dd2-4a84-8255-e5f113addc56','8ae64a31-97f1-4a97-b8e5-605c98929d92']){const r=await rec(id);R[r.ticket_number]={status:r.status,dept:r.department===D?'D':r.department,feed:await feedS(id),hist:(await histRaw(id)).map(h=>(h.occurred_at||'').slice(11,19)+' '+h.action+' '+MASK(JSON.stringify(h.summary||{})).slice(0,120)).reverse()};}
return R;
