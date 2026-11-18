const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=validation',{waitUntil:'domcontentloaded'}); await sleep(9000);
const nm=page.getByText('QA NDC Reject needs a reason',{exact:true}).first();
const row=nm.locator('xpath=ancestor::tr[1]'); log('rowcount', await row.count());
const btns=await row.locator('button,[role=switch],a').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.getAttribute('aria-label')||e.getAttribute('title')||e.innerText||'').slice(0,40)+':'+(e.getAttribute('aria-checked')||'')));
log('btns',btns);
const ed=row.locator('button[aria-label*="Edit" i],button[title*="Edit" i]').first(); if(await ed.count()) await ed.click(); else await row.locator('button').last().click();
await sleep(4000); const d=page.locator('[role=dialog]').last(); log('dlg', await d.count()); const t=(await d.count())?await d.innerText():page.url(); log('editor', t.replace(/\s+/g,' ').slice(0,1500)); await shot('3013-2-editor.png');
