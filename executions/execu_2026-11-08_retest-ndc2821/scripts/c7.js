const fs=require('fs');const IDS=JSON.parse(fs.readFileSync('../../execu_2026-11-06_desk-assignment-skills/out/ids.json','utf8'));const DA=IDS.DA,DB=IDS.DB;
const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const S='../screenshots/raw/';await page.setViewportSize({width:1600,height:1000});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const types=async d=>{const r=await api('GET','/desk/skill-types?department_id='+d);return ((r.j&&r.j.data&&r.j.data.types)||[]);};
const tnames=async d=>(await types(d)).map(t=>t.name);
const openTab=async(tab='skill-types')=>{await page.goto(H+'/settings/customization/skills'+(tab?'?tab='+tab:''),{waitUntil:'commit',timeout:180000});for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(/Department/.test(await txt())&&!/Loading/.test((await txt()).slice(-300)))break;}await page.waitForTimeout(2500);};
const pick=async name=>{const lab=page.getByText('Department',{exact:true}).first();const box=await lab.boundingBox();await page.mouse.click(box.x+box.width+120,box.y+box.height/2);await page.waitForTimeout(1200);const s=page.locator('input[placeholder*="earch" i]:visible').last();if(await s.count()){await s.fill(name).catch(()=>{});await page.waitForTimeout(800);}await page.getByRole('option',{name}).or(page.getByRole('menuitem',{name})).or(page.locator('[role=listbox] >> text="'+name+'"')).first().click({timeout:10000});await page.waitForTimeout(3500);};
const shown=async()=>{const t=await page.locator('button[aria-label^="Delete "]').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label').replace(/^Delete /,'')));return t;};
const toast=async(ms=5000)=>{const seen=[];for(let i=0;i<ms/400;i++){await page.waitForTimeout(400);for(const t of await page.locator('[role=alert],[role=status],[data-sonner-toast]').allInnerTexts().catch(()=>[])){const c=t.replace(/\s+/g,' ').trim();if(c&&!seen.includes(c))seen.push(c);}}return seen;};
const addType=async n=>{await page.getByPlaceholder('e.g. Languages').or(page.getByLabel('Skill type name')).first().fill(n);await page.getByRole('button',{name:'Add type'}).click({timeout:10000});return toast(3500);};
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
