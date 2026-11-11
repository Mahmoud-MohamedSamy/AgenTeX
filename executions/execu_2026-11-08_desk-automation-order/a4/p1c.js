// P23 with skill NAMES (as the editor stores them), P18 with the agent as ticket owner, P24 with a QA contact.
const R={};const sk=((await api('GET','/desk/skills?department_id='+D2)).j?.data?.skills||[]).filter(x=>x.is_active&&!/</.test(x.name));
R.skills=sk.map(x=>x.name+' agents='+x.agent_count);const s1=sk[0]?.name,s2=sk[1]?.name;
const c=await api('POST',`/modules/${CONTACTS}/records`,{data:[{field:'last_name',value:enc('QA AO WF P24 contact')},{field:'email',value:enc('mahmoud.mmohamedsamy+qaaowf@gmail.com')}]});const cid=c.j?.data?.id;if(cid)track('contact',cid,'P24');R.contact=[c.s,cid,cid?null:c.t.slice(0,200)];
const defs={P23a:[[{type:'AddTicketSkills',skillKeys:[s1]}],D2],P23b:[[{type:'RemoveTicketSkills',skillKeys:[s1]}],D2],P23d:[[{type:'ReassignTicketBySkills'}],D2],
 P18g:[[{type:'AddTicketFollowers',followerUserIds:[A1,SAMY]}],D],P24:[[{type:'UpdateRelatedRecord',relatedLookupField:'contact_id',fieldUpdates:{title:{kind:'string',stringValue:'QA AO WF P24 title'}}}],D]};
for(const [t,[a,dep]] of Object.entries(defs))R[t]={rule:await mkRule(t+'c',{kind:'RecordCreated'},a,{departmentIds:[dep]})};
const tv={P23a:{department:D2},P23b:{department:D2,skills:[s1,s2].filter(Boolean)},P23d:{department:D2,skills:[s1]},P18g:{owner:A1},P24:cid?{contact_id:cid}:{}};
for(const t of Object.keys(defs))R[t].ticket=await mkTicket(t+'c',tv[t]);
await sleep(25000);
for(const t of Object.keys(defs)){const id=R[t].ticket?.id;if(!id)continue;const ex=arr2((await api('GET','/workflow/executions?recordId='+id)).j?.data);
 R[t].exec=ex.map(e=>(e.ruleId===R[t].rule.id?'':'other ')+e.outcome+' '+(e.dispatches||[]).map(d=>d.actionType+':'+d.status+' '+String(d.responseBodyTruncated||d.lastError||'').slice(0,170)).join(' | '));
 const tt=await getTicket(id);R[t].after={owner:(tt.owner||'').slice(0,8),skills:tt.skills};
 if(t==='P18g')R[t].followers=JSON.stringify((await api('GET','/desk/tickets/'+id+'/followers')).j?.data).slice(0,250);
 if(t==='P24'&&cid){const cc=(await api('GET',`/modules/${CONTACTS}/records/${cid}`)).j?.data?.data||[];R[t].title=val((cc.find(x=>x.field==='title')||{}).value);}}
fs.writeFileSync('../a4/p1c.json',JSON.stringify(R,null,1));return R;
