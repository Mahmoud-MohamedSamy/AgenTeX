const o={};
const ta=await types(DA),tb=await types(DB);const aGeneral=ta.find(t=>t.name==='General').id,bTech=tb.find(t=>t.name==='Tech').id;
const base=n=>({name:n,is_active:true,description:null,criteria:null,agent_ids:[]});const P='/desk/skills?department_id='+DA;
const x=await api('POST',P,{...base('QA RT14 foreign'),type_id:bTech});o.foreign=x.s+' '+JSON.stringify((x.j&&x.j.error)||{id:x.j&&x.j.data&&x.j.data.id}).slice(0,260);if(x.s<300)LED('UNEXPECTED skill QA RT14 foreign created');
const y=await api('POST',P,{...base('QA RT14 own'),type_id:aGeneral});o.own=y.s+' '+((y.j&&y.j.error&&y.j.error.message)||'');const yid=y.j&&y.j.data&&(y.j.data.id||(y.j.data.skill&&y.j.data.skill.id));if(yid)LED('skill QA RT14 own '+yid+' in Dept A');o.yid=yid;
if(yid){const sk=(await api('GET',P)).j.data.skills.find(s=>s.id===yid);const m=await api('PUT','/desk/skills/'+yid+'?department_id='+DA,{...sk,type_id:bTech});o.moveForeign=m.s+' '+((m.j&&m.j.error&&m.j.error.message)||'');const af=(await api('GET',P)).j.data.skills.find(s=>s.id===yid);o.typeAfterMove=af.type_id===aGeneral?'still General':af.type_id;}
await openTab('');await pick('QA AS6 Dept A');await page.getByRole('button',{name:/add skill|new skill/i}).first().click({timeout:15000});await page.waitForTimeout(2500);
const f=page.locator('[role=dialog]').last();await f.getByText('Choose a skill type').first().click({timeout:10000});await page.waitForTimeout(1500);await page.screenshot({path:S+'c5-type-picker-a.png'});
o.optsA=await page.locator('[role=option]').evaluateAll(e=>e.map(x=>x.innerText.trim()));o.inputs=await page.locator('[role=dialog] input:visible, [role=listbox] input:visible').evaluateAll(e=>e.map(x=>x.placeholder||x.type));
return o;
