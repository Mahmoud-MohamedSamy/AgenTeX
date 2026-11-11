// A4 B14: try to go past 50 Tickets workflow rules (user: "the limit should've been removed"). Inactive, guarded QA rules; deleted after.
const T='88e8ea44-1658-4df3-9930-d0902b91073d',D='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const lst=d=>Array.isArray(d)?d:(d?.items||d?.rules||[]);
const count=async()=>lst((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j?.data).length;
const out={before:await count(),made:[]};
const body=n=>({moduleId:T,layoutId:null,departmentIds:[D],name:'QA AO WF B14 limit '+n,description:'QA limit check, deleted after',
 trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'subject',operator:'StartsWith',caseInsensitive:false,stringValue:'QA AO WF B14 '},
 mode:'Recurring',actions:[{type:'AddTicketComment',order:0,delaySeconds:0,commentBody:'QA AO WF B14',commentPublic:false}],isActive:false});
for(const n of [51,52]){const r=await api('POST','/workflow/rules',body(n));const id=r.j?.data?.id;
 out.made.push({n,s:r.s,id:id||null,err:r.j?.error?.message||null});
 if(id)fs.appendFileSync('../ledger.md',`- ${new Date().toISOString()} A4 B14 rule "QA AO WF B14 limit ${n}" ${id} (inactive)\n`);else break;}
out.after=await count();
out.activate=null;const first=out.made.find(x=>x.id);
if(first){const a=await api('POST','/workflow/rules/'+first.id+'/activate');out.activate={s:a.s,err:a.j?.error?.message||null};if(a.s<300)await api('POST','/workflow/rules/'+first.id+'/deactivate');}
fs.writeFileSync('../a4/b14.json',JSON.stringify(out,null,1));return out;
