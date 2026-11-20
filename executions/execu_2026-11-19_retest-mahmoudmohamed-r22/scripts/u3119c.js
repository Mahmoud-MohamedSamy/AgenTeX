const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});await sleep(9000);
const s=page.getByPlaceholder(/search/i).last();if(await s.count()){await s.fill('3105 part').catch(()=>{});await sleep(3000);}const row=page.locator('tr, [role=row], li, div[class*=row]',{hasText:'QA RT21 W2 3105 part'}).last();await row.locator('button').last().click();await sleep(1000);await page.getByRole('menuitem',{name:/^Edit/}).first().click();await sleep(7000);R.url=page.url().replace(H,'');
const cands=page.locator('button[aria-label*="more" i], button[aria-label*="action" i], button:has-text("…"), button:has-text("...")');R.cands=await cands.count();
if(R.cands){await cands.last().click();await sleep(1500);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3119-r1-f-open-rule-menu.png',{timeout:90000});
 const mi=page.getByRole('menuitem',{name:/Execution history/i}).first();if(await mi.count()){await mi.click();await sleep(6000);R.to=page.url().replace(H,'');}}
else await shot('3119-r1-f-open-rule.png',{timeout:90000});
return R;
