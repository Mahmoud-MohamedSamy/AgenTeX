module.exports=async()=>{const R={};
 for(const p of ['/desk/channels/addresses','/desk/channels/mailboxes','/desk/channels/domains','/desk/channels/settings']){const r=await api('GET',p);const d=r.j&&r.j.data;const L=Array.isArray(d)?d:arr(d);
  R[p]=r.s+' n='+L.length+' '+JSON.stringify(L.slice(0,8).map(x=>({addr:(x.address||x.email||x.forwarding_address||x.inbound_address||x.hostname||x.domain||'').replace(/^[^@]{3}/,'***'),dept:x.department_name||String(x.department_id||'').slice(0,8),state:x.state||x.status||x.verification_status,arrival:x.arrival,inbound:x.inbound_address?String(x.inbound_address).replace(/^[^@]{3}/,'***'):undefined}))).slice(0,900);}
 return R;};
