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
const o={};
const ta=await types(DA),tb=await types(DB);const aGeneral=ta.find(t=>t.name==='General').id,bTech=tb.find(t=>t.name==='Tech').id;const bAlpha=tb.find(t=>t.name==='QA RT14 alpha').id;
// rename to a duplicate through the API
const dup=await api('PUT','/desk/skill-types/'+bAlpha,{name:'Tech',department_id:DB});o.renameDup=dup.s+' '+((dup.j&&dup.j.error&&dup.j.error.message)||'');
const base=n=>({name:n,department_id:DA,is_active:true,description:null,criteria:null,agent_ids:[]});
// A skill with another department's type
const x=await api('POST','/desk/skills',{...base('QA RT14 foreign'),type_id:bTech});o.foreign=x.s+' '+JSON.stringify(x.j&&x.j.error||x.j&&x.j.data&&x.j.data.id).slice(0,240);if(x.s<300)LED('UNEXPECTED skill QA RT14 foreign created '+(x.j.data.id||''));
// A skill with own type
const y=await api('POST','/desk/skills',{...base('QA RT14 own'),type_id:aGeneral});o.own=y.s+' '+((y.j&&y.j.error&&y.j.error.message)||'');const yid=y.j&&y.j.data&&(y.j.data.id||(y.j.data.skill&&y.j.data.skill.id));if(yid){LED('skill QA RT14 own '+yid+' in Dept A');}
o.yid=yid;
// Moving a skill to another department's type
if(yid){const g=await api('GET','/desk/skills?department_id='+DA);const sk=g.j.data.skills.find(s=>s.id===yid);const m=await api('PUT','/desk/skills/'+yid,{...sk,type_id:bTech});o.moveForeign=m.s+' '+((m.j&&m.j.error&&m.j.error.message)||'');const af=(await api('GET','/desk/skills?department_id='+DA)).j.data.skills.find(s=>s.id===yid);o.typeAfterMove=af.type_id===aGeneral?'still General':af.type_id;}
// UI skill form
await openTab('');await pick('QA AS6 Dept A');const add=page.getByRole('button',{name:/add skill|new skill/i}).first();o.addBtn=await add.count();await add.click({timeout:15000});await page.waitForTimeout(2500);await page.screenshot({path:S+'c4-skill-form.png'});
const f=page.locator('[role=dialog]').last();o.formText=(await f.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);o.formControls=await f.locator('input,select,button[role=combobox],[role=combobox]').evaluateAll(e=>e.map(x=>x.tagName+'|'+(x.getAttribute('role')||'')+'|'+(x.getAttribute('aria-label')||x.placeholder||x.id||'')+'|'+(x.innerText||x.value||'').slice(0,40)));
return o;
