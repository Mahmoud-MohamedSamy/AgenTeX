// Read-only: session check, email addresses config, #1 closed_time + activity since 9 Nov, recent inbound on tech/cs.
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const g=async p=>{const r=await api('GET',p);return {s:r.s,j:r.j};};
 R.addresses=m(JSON.stringify((await g('/desk/channels/addresses')).j)).slice(0,4000);
 R.overview=m(JSON.stringify((await g('/desk/channels/sending-overview')).j)).slice(0,1500);
 R.supp=m(JSON.stringify((await g('/desk/channels/suppressions')).j)).slice(0,800);
 const o=fl((await api('GET','/modules/'+T+'/records/'+T1)).j.data);R.t1={status:o.status,closed_time:o.closed_time,modified:o.modified_time||o.updated_at};
 const a=((await api('GET','/desk/tickets/'+T1+'/activity?per_page=200')).j||{});R.t1ActMeta=a.meta;
 R.t1Act=(Array.isArray(a.data)?a.data:[]).filter(x=>x.occurred_at>'2026-11-09T13:00').map(x=>x.occurred_at.slice(0,19)+' '+x.action+' by '+JSON.stringify(x.actor||x.performed_by||x.user||'').slice(0,80)+' '+JSON.stringify(x.summary||{}).slice(0,220));
 return R;};
