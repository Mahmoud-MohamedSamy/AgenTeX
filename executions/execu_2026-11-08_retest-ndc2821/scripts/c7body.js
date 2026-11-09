const o={};const P='/desk/skills?department_id='+DB;
// rename follows the skill, in Dept B only
const tb=await types(DB);const beta=tb.find(t=>t.name==='QA RT14 beta');const r=await api('PUT','/desk/skill-types/'+beta.id+'?department_id='+DB,{name:'QA RT14 beta2'});o.rename=r.s;
const sk=(await api('GET',P)).j.data.skills.find(k=>k.name==='QA RT14 skill beta');o.skillStillOnType=sk.type_id===beta.id;
await openTab('');await pick('QA AS6 Dept B');await page.waitForTimeout(2000);const row=(await txt()).match(/QA RT14 skill beta.{0,60}/);o.skillsRow=row&&row[0];await page.screenshot({path:S+'c7-skills-tab-b.png'});
// type in use in Dept B refused
const d=await api('DELETE','/desk/skill-types/'+beta.id+'?department_id='+DB);o.delInUse=d.s+' '+((d.j&&d.j.error&&d.j.error.message)||'');
// type id from another department: rename/delete through Dept B address
const aT=(await types(DA)).find(t=>t.name==='Tech');const f1=await api('PUT','/desk/skill-types/'+aT.id+'?department_id='+DB,{name:'QA RT14 hack'});o.renameForeign=f1.s;const f2=await api('DELETE','/desk/skill-types/'+aT.id+'?department_id='+DB);o.delForeign=f2.s+' '+((f2.j&&f2.j.error&&f2.j.error.code)||'');o.aTechStill=(await tnames(DA)).includes('Tech');
// move skill to another department's type
const m=await api('PUT','/desk/skills/'+sk.id+'?department_id='+DB,{...sk,type_id:aT.id});o.moveForeign=m.s+' '+JSON.stringify((m.j&&m.j.error&&m.j.error.details)||'');const af=(await api('GET',P)).j.data.skills.find(k=>k.id===sk.id);o.typeAfterMove=af.type_id===beta.id?'unchanged':af.type_id;
// new department starts with no types
const nd=await api('POST','/desk/departments',{name:'QA RT14 Dept New',agent_user_ids:[IDS.A1],visibility:'public'});o.newDept=nd.s+' '+((nd.j&&nd.j.error&&nd.j.error.message)||'');const nid=nd.j&&nd.j.data&&(nd.j.data.id||(nd.j.data.department&&nd.j.data.department.id));if(nid){LED('department QA RT14 Dept New '+nid);fs.writeFileSync('../out/newdept.json',JSON.stringify({id:nid}));o.newTypes=await tnames(nid);await openTab();await pick('QA RT14 Dept New');o.newUi=await shown();await page.screenshot({path:S+'c7-new-dept-empty.png'});o.newText=(await txt()).match(/Skill types group.{0,200}/)?.[0];}
// audit
const au=await api('GET','/audit/events?app_key=desk&limit=30');const ev=arr(au.j&&au.j.data).filter(e=>/skill_type/.test(JSON.stringify(e))).slice(0,3);o.audit=ev.map(e=>JSON.stringify({a:e.action,t:e.resource_type||e.entity_type,l:e.resource_label||e.record_label||e.summary}).slice(0,180));
return o;
