async (page) => { await page.getByText('Add Activity', { exact: true }).first().click(); await page.waitForTimeout(2000);
 const m = await page.innerText('body'); await page.getByText('Task', { exact: true }).last().click().catch(e=>{}); await page.waitForTimeout(6000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-add-task.png'});
 const t = await page.innerText('body'); const i = t.search(/Subject/); return { menu: m.slice(m.indexOf('Add Activity'), m.indexOf('Add Activity')+80), form: t.slice(Math.max(0,i-200), i + 900) }; }
