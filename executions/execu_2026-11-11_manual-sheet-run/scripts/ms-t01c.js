// T-01-02 create "QA MAN view" (Subject contains QA MAN, Department = Marketing, shared with all agents); check rows.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';
 const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const pickIn=async(btn,val)=>{await btn.click();await pg.waitForTimeout(1000);const inp=pg.locator('[role=listbox] input,[data-radix-popper-content-wrapper] input,[cmdk-input]').first();if(await inp.count()){await inp.fill(val);await pg.waitForTimeout(1200);}const o=pg.locator('[role=option]').filter({hasText:new RegExp('^\\s*'+val+'\\s*$','i')}).first();if(!(await o.count())){const all=await pg.locator('[role=option]').allInnerTexts();await pg.keyboard.press('Escape');return 'no '+val+' in '+all.slice(0,20).join('|');}await o.click();await pg.waitForTimeout(800);return 'ok';};
 try{
 step='open';await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/ALL VIEWS/i.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);
 await pg.getByRole('button',{name:'Add Custom View'}).first().click();await pg.waitForTimeout(3000);const dlg=pg.locator('[role=dialog]').filter({hasText:'Add Custom View'}).last();
 await dlg.getByPlaceholder('Enter view name').fill('QA MAN view');
 step='row1';R.f1=await pickIn(dlg.getByRole('button',{name:/Select a field|Criteria field/}).first(),'Subject');R.o1=await pickIn(dlg.getByRole('button',{name:/Operator/}).first(),'contains');
 R.valInputs=await dlg.evaluate(d=>[...d.querySelectorAll('input')].map(i=>(i.getAttribute('aria-label')||i.placeholder||i.type)));
 const v1=dlg.locator('input[type=text]:not([placeholder="Enter view name"])').last();await v1.fill('QA MAN');
 step='row2';await dlg.getByRole('button',{name:'Add criteria row'}).click();await pg.waitForTimeout(1000);
 const fbtns=dlg.getByRole('button',{name:/Select a field|Criteria field/});R.f2=await pickIn(fbtns.last(),'Department');R.o2='kept Contains any of';
 await pg.waitForTimeout(800);R.row2Html=await dlg.evaluate(d=>d.innerText.replace(/\s+/g,' ').slice(0,400));
 const vb=dlg.locator('[aria-label="Value for Department"]').first();R.vbTag=await vb.evaluate(e=>e.tagName+' '+e.getAttribute('role')).catch(()=>'none');await vb.click();await pg.keyboard.type('Marketing');await pg.waitForTimeout(1500);R.v2opts=await pg.locator('[role=option]').allInnerTexts();const mo=pg.locator('[role=option]').filter({hasText:/^s*Marketings*$/}).first();if(await mo.count())await mo.click();else await pg.keyboard.press('Enter');await pg.waitForTimeout(800);R.v2val=await dlg.evaluate(d=>d.innerText.replace(/s+/g,' ').match(/Department.{0,80}/)?.[0]);
 step='share';await dlg.getByText('All agents',{exact:true}).click();await L.shot('t01-02-filled');
 R.pattern=await dlg.evaluate(d=>d.innerText.replace(/\s+/g,' ').match(/(Criteria pattern|1 AND 2|AND|OR).{0,60}/)?.[0]||null);
 await dlg.getByRole('button',{name:/^Save$/}).click();R.saveToast=await toast();await pg.waitForTimeout(6000);R.url=pg.url();
 step='rows';const t=await L.body_txt();R.head=t.match(/QA MAN view \(\d+\)/)?.[0];R.rows=await pg.evaluate(()=>[...document.querySelectorAll('main [aria-label^="Select "]')].map(e=>e.getAttribute('aria-label').replace('Select ','')).filter(x=>x!=='all'));await L.shot('t01-02-view');
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);await L.shot('t01-err');}return R;};
