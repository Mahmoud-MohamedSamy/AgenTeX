// T-04-06 save from template (subject combobox), T-04-05 typed values kept on department switch to a dept with its own layout.
const L=require('./lib');
module.exports=async()=>{const R={};
 const tpls=((await api('GET','/desk/ticket-templates')).j||{}).data;R.tpls=(tpls&&tpls.templates||[]).map(t=>({id:t.id,name:t.name,dept:t.department_name,keys:Object.keys(t).join(',')}));
 const tmk=(tpls.templates||[]).find(t=>t.department_id===L.D.MK);R.tmk=tmk&&JSON.stringify(tmk).slice(0,600);
 // 06
 await L.gotoNew();await L.pickF('department','Marketing');await pg.waitForTimeout(2000);
 const subj=pg.locator('[data-rule-field="subject"] input').first();await subj.click();await pg.waitForTimeout(2000);R.subjOpts=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);
 const opt=pg.locator('[role=option]').filter({hasText:tmk?tmk.name:'template'}).first();
 if(await opt.count()){await opt.click();await pg.waitForTimeout(2500);R.filled=await pg.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-rule-field]')].map(e=>[e.getAttribute('data-rule-field'),(e.querySelector('input')?.value||e.innerText).replace(/\s+/g,' ').trim().slice(0,60)])));await L.shot('t04-06-filled');
  const stv=R.filled.status||'';if(/Select/.test(stv))await L.pickF('status','Open');const sub=await subj.inputValue();R.subjectValue=sub;
  await pg.getByRole('button',{name:/^Save$/}).click();await pg.waitForTimeout(8000);R.url=pg.url();await L.shot('t04-06-saved');
  const m=pg.url().match(/tickets\/([0-9a-f-]{36})/);if(m){const o=fl((await api('GET','/modules/'+T+'/records/'+m[1])).j.data);R.saved={id:o.id,subject:o.subject,priority:o.priority,channel:o.channel,language:o.language,classification:o.classification,category:o.category};LED('T-04-06 ticket from template '+o.id);}}
 else{R.noTemplateOption=true;await pg.keyboard.press('Escape');}
 // 05
 await L.gotoNew();await L.pickF('department','Marketing');await pg.waitForTimeout(1500);R.layoutMk=await pg.evaluate(()=>{const s=document.querySelector('select');return s.options[s.selectedIndex].text;});R.keysMk=await L.fieldKeys();
 await subj.fill('QA MAN layout keep');await pg.locator('[data-rule-field="description"] textarea').first().fill('keep me');
 R.sw=await L.pickF('department','QA NDC Accounting');await pg.waitForTimeout(4000);
 R.layoutAcc=await pg.evaluate(()=>{const s=document.querySelector('select');return s.options[s.selectedIndex].text;});R.keysAcc=await L.fieldKeys();
 R.kept={subject:await pg.locator('[data-rule-field="subject"] input').first().inputValue().catch(()=>null),desc:await pg.locator('[data-rule-field="description"] textarea').first().inputValue().catch(()=>null)};await L.shot('t04-05-switched');
 await pg.getByRole('button',{name:/^Cancel$/}).click().catch(()=>{});return R;};
