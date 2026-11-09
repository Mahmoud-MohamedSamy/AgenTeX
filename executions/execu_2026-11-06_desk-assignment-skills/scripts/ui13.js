// H-09: Assign by Skills on one ticket (offline agents allowed temporarily)
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
await page.setViewportSize({width:1600,height:1000});const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});
const t=await mkTicket('QA AS6 SKR QA AS6 SK2 h09',IDS.DA,{},'H-09');await W(4000);
o.before={owner:nm((await own(t.id)).owner),skills:(await getT(t.id)).skills};
const reqs=[];page.on('response',async r=>{const u=r.url();if(r.request().method()!=='GET'&&/\/api\/v1\/desk/.test(u))reqs.push(r.request().method()+' '+u.replace(/^.*\/api\/v1/,'')+' '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,250));});
await page.goto(H+'/views/all/tickets/'+t.id,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 SKR QA AS6 SK2 h09/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
await page.mouse.click(1569,103);await page.waitForTimeout(1200);
await page.getByRole('menuitem',{name:/Assign by Skills/}).click();await page.waitForTimeout(2000);
o.dialog=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);await shot('ui-24-assign-by-skills');
const ok=page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/Assign|Confirm|Yes|Run/i});if(await ok.count()){await ok.first().click();}
let toast='';for(let i=0;i<16&&!toast;i++){await page.waitForTimeout(250);toast=(await page.locator('[data-sonner-toast],[role=status]').allInnerTexts().catch(()=>[])).join(' | ');}o.toast=toast;
await page.waitForTimeout(3000);o.after={owner:nm((await own(t.id)).owner),h:(await hist(t.id)).slice(0,3)};o.reqs=reqs;
await shot('ui-25-after-assign-by-skills');
o.back=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;LED('H-09: Dept A offline agents ON temporarily, restored');
return o;
