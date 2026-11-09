// 7 Nov D-14: New Ticket form, owner cleared vs default owner, Dept A RR seq on create (offline agents allowed temporarily)
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O (creator)';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
await page.setViewportSize({width:1600,height:1000});
const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;const seq0=(await getRule(IDS.RR_SEQ)).execute_on;
await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});await putRule(IDS.RR_SEQ,{execute_on:['create','update']});
const field=lbl=>page.locator('main').locator('div').filter({has:page.locator('label',{hasText:new RegExp('^\\*?'+lbl+'$')})}).last();
const one=async(subject,clear,tag)=>{const r={};
  await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Information/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
  // department
  const dep=field('Department');await dep.getByText('Customer Support').first().click();await page.waitForTimeout(800);
  await page.getByRole('option',{name:'QA AS6 Dept A'}).first().click().catch(async()=>{await page.keyboard.type('QA AS6 Dept A');await page.waitForTimeout(800);await page.keyboard.press('Enter');});await page.waitForTimeout(800);
  await field('Subject').locator('input').first().fill(subject);
  const st=field('Status');await st.getByText('Select').first().click();await page.waitForTimeout(600);await page.getByRole('option',{name:/^Open$/}).first().click().catch(()=>{});await page.waitForTimeout(500);
  const ow=field('Ticket Owner');r.ownerBefore=(await ow.innerText()).replace(/\s+/g,' ');
  if(clear){const x=ow.getByRole('button',{name:/clear|remove/i});r.clearBtn=await x.count();if(r.clearBtn)await x.first().click();else{await ow.locator('[role=combobox],button').first().click();await page.waitForTimeout(600);await page.keyboard.press('Backspace');await page.keyboard.press('Escape');}await page.waitForTimeout(600);}
  r.ownerAtSave=(await ow.innerText()).replace(/\s+/g,' ');
  await shot('ui-21-form-'+tag);
  await page.getByRole('button',{name:/^Save$/}).last().click();await page.waitForTimeout(6000);
  r.url=page.url();const id=(r.url.match(/records\/([0-9a-f-]{36})/)||[])[1];r.id=id;
  if(id){LED('ticket "'+subject+'" '+id+' D-14 form');const w=await own(id);r.owner=nm(w.owner);r.dept=w.dept===IDS.DA?'DA':w.dept;r.h=(await hist(id)).slice(0,3);}
  else r.body=(await page.innerText('main')).replace(/\s+/g,' ').slice(0,400);
  return r;};
o.cleared=await one('QA AS6 SEQ D14 form owner cleared',true,'cleared');
o.kept=await one('QA AS6 SEQ D14 form owner default',false,'default');
o.back=[(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s,sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s];
LED('D-14 form: RR_SEQ create + Dept A offline agents ON temporarily, restored');
return o;
