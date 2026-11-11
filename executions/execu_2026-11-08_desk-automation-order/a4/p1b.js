// P18 with other followers, P23 in QA AS6 Dept A with a real skill, P24 with the Contacts "title" field.
const R={};const sk=(await api('GET','/desk/skills?department_id='+D2)).j?.data?.skills||[];
R.skillFields=sk[0]?Object.keys(sk[0]).join(','):'';const s=sk.find(x=>x.is_active)||{};R.skillUsed=[s.id&&s.id.slice(0,8),s.key||s.slug||null];
const key=s.key||s.slug||s.id;
const defs={P18o:[{type:'AddTicketFollowers',followerUserIds:[OWNER]}],P18a:[{type:'AddTicketFollowers',followerUserIds:[A1,SAMY]}],
 P24:[{type:'UpdateRelatedRecord',relatedLookupField:'contact_id',fieldUpdates:{title:{kind:'string',stringValue:'QA AO WF P24 title'}}}]};
for(const [t,a] of Object.entries(defs))R[t]={rule:await mkRule(t,{kind:'RecordCreated'},a)};
// skills rule scoped to QA AS6 Dept A
R.P23a={rule:await mkRule('P23a2',{kind:'RecordCreated'},[{type:'AddTicketSkills',skillKeys:[key]}],{departmentIds:[D2]})};
for(const t of Object.keys(defs))R[t].ticket=await mkTicket(t);
R.P23a.ticket=await mkTicket('P23a2',{department:D2});
await sleep(25000);
for(const t of [...Object.keys(defs),'P23a']){const id=R[t].ticket?.id;if(!id)continue;const ex=arr2((await api('GET','/workflow/executions?recordId='+id)).j?.data);
 R[t].exec=ex.map(e=>e.outcome+' '+(e.dispatches||[]).map(d=>d.actionType+':'+d.status+' '+String(d.responseBodyTruncated||d.lastError||'').slice(0,160)).join(' | '));
 if(/P18/.test(t))R[t].followers=JSON.stringify((await api('GET','/desk/tickets/'+id+'/followers')).j?.data).slice(0,200);
 if(t==='P23a')R[t].skills=(await getTicket(id)).skills;
 if(t==='P24'){const tt=await getTicket(id);R[t].contact=tt.contact_id;if(tt.contact_id){const c=(await api('GET',`/modules/${CONTACTS}/records/${tt.contact_id}`)).j?.data?.data||[];R[t].title=val((c.find(x=>x.field==='title')||{}).value);}}}
fs.writeFileSync('../a4/p1b.json',JSON.stringify(R,null,1));return R;
