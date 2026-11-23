const R={};const bad=[];page.on('response',r=>{if(r.status()===404)bad.push(r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').replace(/[?].*/,''));});
await page.goto(H+'/settings/automation/workflow-rules/1a704422-e849-4321-94ea-51177b6d1850',{waitUntil:'commit'});await page.getByText('QA RT21 W2 3105 part').first().waitFor({timeout:90000});await sleep(6000);
await page.mouse.click(1338,84);await sleep(1500);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3119-r1-f-open-rule-menu.png',{timeout:90000});
const mi=page.getByRole('menuitem',{name:/Execution history/i}).first();if(await mi.count()){await mi.click();await sleep(6000);R.to=page.url().replace(H,'');}
R.notFound=[...new Set(bad)];return R;
