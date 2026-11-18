await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup/landing', { waitUntil: 'commit', timeout: 60000 }).catch(()=>{});
await page.waitForTimeout(12000);
out.url1 = page.url();
const imp = page.getByText(/^Import$/).first(); out.cnt = await page.getByText(/^Import$/).count();
const links = await page.$$eval('a', as => as.filter(a => /import/i.test(a.innerText + a.getAttribute('href'))).map(a => (a.innerText.trim() + ' -> ' + a.getAttribute('href')).slice(0, 150)));
out.links = links;
if (out.cnt) { await imp.click(); await page.waitForTimeout(8000); out.url2 = page.url(); out.txt = (await body(page)).slice(0, 1500); }
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/shots/02-setup.png' });
