module.exports=async()=>{const R={};const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';const techId='1223e44e-d4d6-45a2-a3fd-ada911cef2eb';
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 R.q=arr(((await api('GET','/modules/'+T+'/records?q=TAVI2TAVI&per_page=50')).j||{}).data).map(fl).map(o=>o.ticket_number+' '+o.subject+' '+o.created_time);
 const r=await api('GET','/modules/'+T+'/records?page=1&per_page=30&sort_by=created_time&sort_dir=desc');R.latest=arr(r.j&&r.j.data).map(fl).filter(o=>String(o.created_time||'')>'2026-11-10T14:50').map(o=>o.ticket_number+' '+m(o.subject)+' '+o.created_time);
 R.techReps=((((await api('GET','/desk/tickets/'+techId+'/replies')).j||{}).data)||[]).map(x=>x.direction+' '+x.status+' '+x.created_at);
 for(const p of ['/desk/channels/quarantine','/desk/channels/spam-contacts','/desk/channels/suppressions']){const x=await api('GET',p);R[p]=x.s+' '+m(x.t).slice(0,600);}
 const g=arr(((await api('GET','/modules/'+T+'/records?q=QA%20EM-02&per_page=20')).j||{}).data).map(fl).find(o=>String(o.ticket_number)==='2496');
 if(g){const a=((await api('GET','/desk/tickets/'+g.id+'/activity')).j||{}).data||[];R.em02Act=a.filter(x=>/message/.test(x.action)).map(x=>x.occurred_at.slice(0,19)+' '+x.action+' '+m(JSON.stringify(x.summary)).slice(0,200));}else R.em02='not found';
 return R;};
