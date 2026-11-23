const R={reqs:[]};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
page.on('response',async r=>{const u=r.url();if(/validation/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/settings/modules-and-fields/'+L,{waitUntil:'domcontentloaded'});
for(let i=0;i<80;i++){await sleep(3000);if(await page.getByText(/^Validation Rules$/i).count())break;}
await page.getByText(/^Validation Rules$/i).first().click();for(let i=0;i<30;i++){await sleep(2000);if(await page.getByRole('button',{name:'New Rule'}).count())break;}
await page.getByRole('button',{name:'New Rule'}).first().click();await sleep(3000);
const dlg=page.locator('[role=dialog]:visible').last();
await dlg.getByPlaceholder('e.g. Serial number format').fill('QA RT26 VR');
await dlg.getByText('Choose a field…').click();await sleep(1500);
const opts=page.locator('[role=option]:visible');R.opts=(await opts.allInnerTexts()).slice(0,12);
const want=R.opts.findIndex(o=>/^(Last Name|First Name|Company|Description)$/i.test(o.trim()));await opts.nth(want>=0?want:0).click();await sleep(2000);
const sw=dlg.getByRole('switch').first();R.activeBefore=await sw.getAttribute('aria-checked');if(R.activeBefore==='true'){await sw.click();await sleep(500);}R.activeAfter=await sw.getAttribute('aria-checked');
const em=dlg.locator('textarea:visible, input:visible').filter({hasNot:page.locator('[placeholder="e.g. Serial number format"]')});
const lab=dlg.getByText('Error message (English)').first();await lab.scrollIntoViewIfNeeded();await lab.locator('xpath=following::*[self::textarea or self::input][1]').fill('QA RT26 VR test message');await sleep(500);
await dlg.getByRole('button',{name:'Save',exact:true}).click();await sleep(6000);R.afterSave=(await page.locator('main').first().innerText()).replace(/\s+/g,' ').match(/.{0,40}QA RT26 VR.{0,80}/)?.[0];await shot('3126-saved.png');
// open edit
const row=page.locator('tr',{hasText:'QA RT26 VR'}).first();await row.hover();await sleep(500);
const pen=row.locator('button').filter({has:page.locator('svg')});R.rowBtns=await pen.count();
await pen.first().click();await sleep(4000);const d2=page.locator('[role=dialog]:visible').last();R.editTitle=(await d2.innerText().catch(()=>'')).slice(0,40);
await shot('3126-edit-top.png');
R.geom=await d2.evaluate(d=>{const r=d.getBoundingClientRect();const pick=[...d.querySelectorAll('input,textarea,button[role=combobox],[role=radio],[role=switch],label')].filter(e=>e.offsetParent);return {dl:Math.round(r.left),dr:Math.round(r.right),minL:Math.min(...pick.map(e=>Math.round(e.getBoundingClientRect().left-r.left))),minR:Math.min(...pick.map(e=>Math.round(r.right-e.getBoundingClientRect().right)))};});
R.labelStyles=await d2.evaluate(d=>[...d.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^(Rule name\*?|Description|Layout|Field to check|When the rule is broken|Show the error|Rule type|LAYOUT|FIELD TO CHECK)$/i.test(e.innerText.trim())).map(e=>{const s=getComputedStyle(e);return e.innerText.trim()+' |'+s.textTransform+'|'+s.fontSize+'|'+s.fontWeight+'|'+s.color}));
R.radios=await d2.evaluate(d=>[...d.querySelectorAll('[role=radiogroup]')].map(g=>{const rs=[...g.querySelectorAll('[role=radio], input[type=radio]')].map(x=>x.getBoundingClientRect());return {n:rs.length,sameRow:rs.length>1&&Math.abs(rs[0].top-rs[1].top)<5,flex:getComputedStyle(g).flexDirection};}));
await d2.evaluate(d=>{const sc=[...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+20&&/auto|scroll/.test(getComputedStyle(e).overflowY));if(sc)sc.scrollTop=420;});await sleep(800);await shot('3126-edit-mid.png');
return R;
