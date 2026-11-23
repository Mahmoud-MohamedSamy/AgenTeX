const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const R={};
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});for(let i=0;i<40;i++){await sleep(2000);if(/records/.test(await page.locator('main').first().innerText().catch(()=>'')))break;}await sleep(4000);
R.rows=await page.locator('table tbody tr').count();R.kanban=/No Answer/.test(await page.locator('main').first().innerText());await shot('crm-leads-now.png');return R;
