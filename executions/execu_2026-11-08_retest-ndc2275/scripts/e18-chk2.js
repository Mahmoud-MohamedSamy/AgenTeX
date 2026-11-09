module.exports=async()=>{const R={};const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@');
 for(const p of ['/desk/channels/quarantine','/desk/channels/spam-contacts','/desk/channels/suppressions']){const r=await api('GET',p);R[p]=r.s+' '+m(r.t.slice(0,600));}
 const r=await api('GET','/modules/'+T+'/records?page=1&per_page=60&sort_by=created_at&sort_dir=desc');R.recentEmailTickets=arr(r.j.data).map(fl).filter(o=>String(o.created_at)>'2026-11-09T12:45'&&(o.channel==='email'||/anyware/i.test(String(o.email)))).map(o=>({no:o.ticket_number,s:String(o.subject).slice(0,40),c:String(o.created_at).slice(11,19),ch:o.channel,em:m(o.email)}));
 return R;};
