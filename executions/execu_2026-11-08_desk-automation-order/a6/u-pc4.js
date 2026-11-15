// OR-24: make the screen ticket (owner, Create Ticket form, owner cleared) and the web-form ticket (signed out, QA AS6 D14 form iframe address).
const M=JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(),'executions/execu_2026-11-08_desk-automation-order/pc4.json'),'utf8'));const k=M.k;
await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new');await sleep(9000);
// department
await page.getByText('Department',{exact:true}).first().scrollIntoViewIfNeeded().catch(()=>{});
const dep=page.locator('label:has-text("Department")').locator('xpath=following::*[1]').first();
await page.mouse.click(1240,452);await sleep(1200);await page.keyboard.type('QA AS6 Dept A');await sleep(2000);
const opt=page.getByRole('option',{name:/QA AS6 Dept A/}).first();if(await opt.count())await opt.click();else await page.keyboard.press('Enter');await sleep(1500);
// subject + description
await page.mouse.click(990,617);await sleep(500);await page.keyboard.type('QA AO '+k+' screen');await sleep(800);await page.keyboard.press('Escape');
await page.locator('textarea').first().fill('QA AO OR-24 screen channel');
// status
await page.mouse.click(755,765);await sleep(1000);const op=page.getByRole('option',{name:/^Open$/}).first();if(await op.count())await op.click();else{await page.keyboard.type('Open');await page.keyboard.press('Enter');}await sleep(800);
// clear owner (×) so round robin can assign
await page.mouse.click(1367,767);await sleep(1000);
await shot('pc24-screen-filled');
await page.getByRole('button',{name:'Save',exact:true}).click();await sleep(8000);log('after save url',page.url());await shot('pc24-screen-saved');
// web form, signed out
const SD='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad';const key=JSON.parse(require('fs').readFileSync(SD+'/wfd14.json','utf8')).embed_key;
const c2=await ctx.browser().newContext({viewport:{width:1280,height:1000}});const p=await c2.newPage();
const resp=await p.goto('https://staging-crm.taviportal.com/embed/feedback/index.html?key='+encodeURIComponent(key)+'&mode=frame',{waitUntil:'domcontentloaded',timeout:90000});log('form status',resp&&resp.status());
for(let i=0;i<20;i++){await p.waitForTimeout(1500);if(await p.locator('input,textarea').count()>2)break;}
const fill=async(lab,val)=>{const l=p.getByLabel(new RegExp('^'+lab,'i')).first();if(await l.count()){await l.fill(val);return 'ok';}return 'missing';};
log('fill',{last:await fill('Last Name','QA AO PC24 Web'),first:await fill('First Name','QA'),email:await fill('Email','qa.ao.pc24web@example.net'),subject:await fill('Subject','QA AO '+k+' web form'),desc:await fill('Description','QA AO OR-24 web form channel')});
await p.getByRole('button',{name:/^(Send|Submit)/i}).first().click();await p.waitForTimeout(6000);log('form after',(await p.innerText('body')).replace(/\s+/g,' ').slice(0,150));await c2.close();
return {ok:1};
