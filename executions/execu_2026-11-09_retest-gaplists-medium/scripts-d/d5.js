const reqs=[];page.on('request',q=>{const u=q.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth'))reqs.push(q.method()+' '+u.split('/api/v1')[1].slice(0,180));});
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings/customization/skills',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
const row=page.getByText('escalation_handling',{exact:true}).first();await row.hover();await page.waitForTimeout(800);
// find menu buttons in the row
const rowEl=row.locator('xpath=ancestor::*[self::tr or @role="row"][1]');
const btns=await rowEl.locator('button').evaluateAll(b=>b.map(x=>x.getAttribute('aria-label')||x.innerText.trim()));
let opened=null;
for(const lab of ['More','Actions','Skill actions','Options','More actions']){const b=rowEl.getByRole('button',{name:new RegExp(lab,'i')});if(await b.count()){await b.first().click();opened=lab;break;}}
if(!opened&&btns.length){await rowEl.locator('button').last().click();opened='last';}
await page.waitForTimeout(1500);
const menu=await page.locator('[role=menu],[role=menuitem]').allInnerTexts().catch(()=>[]);
const del=page.getByRole('menuitem',{name:/delete/i});let dlg=null;
if(await del.count()){await del.first().click();await page.waitForTimeout(4000);dlg=await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>null);await page.screenshot({path:'../ndc-2805/evidence/raw/skill-delete-dialog.png'});}
return {btns,opened,menu,dlg,reqs:[...new Set(reqs)].filter(x=>/skill|usage|where|refer|depend/i.test(x))};
