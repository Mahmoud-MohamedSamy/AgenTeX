const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=validation',{waitUntil:'domcontentloaded'}); await page.getByText('QA NDC Reject needs a reason',{exact:true}).first().waitFor({timeout:90000}).catch(async()=>{log('url',page.url());log('body',(await text()).slice(0,500));}); await sleep(3000);
const nm=page.getByText('QA NDC Reject needs a reason',{exact:true}).first();
const row=nm.locator('xpath=ancestor::tr[1]'); log('rowcount', await row.count()); log('row', (await row.innerText()).replace(/\s+/g,' '));
log('bbox', await row.boundingBox());
log('pageHasCant', /can't be applied/i.test(await text()));
await shot('3013-1-list.png');
const ed=row.locator('button[aria-label*="Edit" i],button[title*="Edit" i]').first(); if(await ed.count()) await ed.click(); else await row.locator('button').last().click();
await sleep(4000); const d=page.locator('[role=dialog]').last(); log('dlg', await d.count()); const t=(await d.count())?await d.innerText():page.url(); log('editor', t.replace(/\s+/g,' ').slice(0,1800)); log('dbox', await d.boundingBox().catch(()=>null)); await shot('3013-2-editor.png');
