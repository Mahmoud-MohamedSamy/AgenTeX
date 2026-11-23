await page.goto(H+'/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records',{waitUntil:'commit'});await page.getByText('All Leads').first().waitFor({timeout:120000}).catch(()=>{});await sleep(4000);
await page.getByText(/^All Leads/).first().click({timeout:15000});await sleep(2000);const s=page.getByPlaceholder('Search views');await s.waitFor({timeout:15000});await s.fill('QA RT20 SC hot');await sleep(2000);
await page.getByText('QA RT20 SC hot leads').last().click({timeout:10000});await sleep(5000);return (await page.locator('main').innerText()).slice(0,120).replace(/\s+/g,' ');
