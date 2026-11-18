const out={};const T=()=>new Date().toISOString().slice(11,19);
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){await sleep(2000);if(/Support Plan/i.test(await text()))break;}await sleep(2500);
const deptBtn=()=>page.locator('xpath=//*[normalize-space(text())="Department"]/following::*[self::button or @role="combobox" or self::select][1]').first();
const planBox=()=>page.locator('xpath=//*[normalize-space(text())="Support Plan"]/following::*[self::button or self::input or @role="combobox"][1]').first();
const planCtx=async()=>(await text()).replace(/\s+/g,' ').match(/Support Plan.{0,260}/)?.[0];
const listPlans=async k=>{await planBox().click();await sleep(2500);const opts=await page.locator('[role=option]').evaluateAll(es=>es.map(e=>(e.innerText||'').replace(/\s+/g,' ').slice(0,60)+' sel='+e.getAttribute('aria-selected')+' chk='+(e.getAttribute('data-state')||'')+(e.querySelector('svg')?' svg':'')));await shot('F11-'+k+'.png');await page.keyboard.press('Escape');await sleep(800);return opts;};
const pickDept=async name=>{const d=deptBtn();const tag=await d.evaluate(e=>e.tagName);if(tag==='SELECT')await d.selectOption({label:name});else{await d.click();await sleep(1500);await page.getByRole('option',{name,exact:true}).first().click().catch(async()=>{await page.getByText(name,{exact:true}).last().click();});}await sleep(2500);};
out.dept0=(await deptBtn().evaluate(e=>e.innerText||e.value).catch(()=>'?'));
out.help0=await planCtx();await shot('F11-1-default-help.png');
const hb=page.getByText(/Plans of the contract/).first();out.helpBox=await hb.boundingBox().catch(()=>null);out.helpText=await hb.innerText().catch(()=>null);
await pickDept('QA RT19 SLA Dept');out.helpA=await planCtx();
await planBox().click();await sleep(1500);await page.getByText('QA RT20 BS Plan 2841 A w2pv').first().click();await sleep(1500);
await pickDept('QA RT19 SLA Dept B');await sleep(1500);out.afterDeptChange=await planCtx();await shot('F11-2-deptchanged.png');
const net=[];page.on('response',r=>{if(/\/records/.test(r.url())&&r.request().method()==='POST')net.push(r.status());});
await page.locator('xpath=//*[normalize-space(text())="Contract Name"]/following::input[1]').first().fill('QA RT21 TK F11 Contract UI');
const acc=page.getByRole('combobox').filter({hasText:/Choose a record/}).first();await acc.click();await sleep(1200);await page.keyboard.type('QA RT20 BS Account 2841 w2pv');await sleep(3000);await page.getByText('QA RT20 BS Account 2841 w2pv').last().click();await sleep(1200);await page.getByRole('button',{name:/^Select$/}).last().click();await sleep(1500);
const sd=page.locator('input[type=date]').first();await sd.fill(new Date().toISOString().slice(0,10)).catch(()=>{});await sleep(800);
out.t_save1=T();await page.getByRole('button',{name:/^Save$/}).first().click();await sleep(4000);
out.save1={net:[...net],msg:(await text()).replace(/\s+/g,' ').match(/(This plan belongs|another department)[^.]{0,160}\./g),url:page.url().replace(H,'')};
await shot('F11-3-save-mismatch.png',{fullPage:true});
if(!/records\/[0-9a-f-]{36}$/.test(page.url())){
 await planBox().click();await sleep(1500);await page.getByText('QA RT20 BS Plan 2841 B w2pv').first().click();await sleep(2000);out.t_fix=T();
 out.afterFix=await planCtx();out.errStill=(await text()).replace(/\s+/g,' ').match(/(This plan belongs|another department)[^.]{0,160}\./g);
 const eb=page.getByText(/belongs to another department/).first();out.errBox=await eb.boundingBox().catch(()=>null);
 await shot('F11-4-after-fix.png');
 out.listAfterFix=await listPlans('5-list-after-fix');
}else{out.CREATED=page.url();}
return out;
