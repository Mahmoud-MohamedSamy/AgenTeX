eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};o.pres=(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]})).j.data.agents.map(a=>nm(a.user_id)+':'+(a.presence.online?'on':'off')+'/email '+a.presence.channels.email);
o.rrSeq=await getRule(IDS.RR_SEQ).then(g=>({name:g.name,active:g.is_active,exec:g.execute_on,dept:g.department_id===IDS.DA,targets:JSON.stringify(g.targets||g.pool||'').slice(0,300)}));
o.rrDA=(await rules('round_robin',IDS.DA)).map(r=>r.name+' active='+r.is_active+' exec='+r.execute_on);
o.prefs=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).t.slice(0,500);
o.directActive=(await rules('direct')).filter(r=>r.is_active).map(r=>r.name);
// API create probes: plain, top-level source api, data field source
const b=body({subject:'QA RT14 2813 api plain',department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com'});
const mk=async(lbl,bb)=>{const r=await api('POST','/modules/'+T+'/records',bb);const id=r.j?.data?.id;if(id)LED('ticket "'+lbl+'" '+id+' NDC-2813 probe');return {s:r.s,e:E(r),owner:id?nm((await own(id)).owner):null,id};};
o.plain=await mk('QA RT14 2813 api plain',b);
o.topSource=await mk('QA RT14 2813 api source top',{...body({subject:'QA RT14 2813 api source top',department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com'}),source:'api'});
o.fieldSource=await mk('QA RT14 2813 api source field',body({subject:'QA RT14 2813 api source field',department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com',source:'api'}));
o.fieldChannel=await mk('QA RT14 2813 api channel field',body({subject:'QA RT14 2813 api channel field',department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com',channel:'api'}));
return o;
