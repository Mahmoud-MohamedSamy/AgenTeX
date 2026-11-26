await page.goto('https://crm.zoho.com/crm/org946877290/settings/modules', { waitUntil: 'domcontentloaded' }); await sleep(10000);
await page.screenshot({ path: RUN + '/zoho/z-modules.png' }); log('url', page.url());
await page.getByText('Leads', { exact: true }).first().click().catch(e => log('leads click', e.message.split('\n')[0])); await sleep(8000);
log('url2', page.url()); await page.screenshot({ path: RUN + '/zoho/z-leads.png' });
const t = await page.innerText('body'); log(t.slice(0, 600).replace(/\n+/g, ' | '));
