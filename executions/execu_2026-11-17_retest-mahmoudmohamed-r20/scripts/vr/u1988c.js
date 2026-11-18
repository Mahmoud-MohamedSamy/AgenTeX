await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/913b2c84-f235-404d-b563-c2cfa9566b6a',{waitUntil:'domcontentloaded'}); await page.getByText('Ticket Information').first().waitFor({timeout:90000}); await sleep(5000);
const lab=page.getByText('Priority',{exact:true}).first(); await lab.scrollIntoViewIfNeeded(); const row=lab.locator('xpath=ancestor::div[.//button][1]'); await lab.hover(); await sleep(800);
log('rowBtns', await row.locator('button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.getAttribute('title')||e.innerText||'?').trim().slice(0,40))));
await shot('1988-3b-hover.png');
const b=row.locator('button').last(); await b.click(); await sleep(1500);
const menu=page.locator('[role=menu],[role=dialog],[data-radix-popper-content-wrapper]').last(); log('menuCount',await menu.count()); log('menu', (await menu.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,800)); await shot('1988-3c-field-menu.png');
