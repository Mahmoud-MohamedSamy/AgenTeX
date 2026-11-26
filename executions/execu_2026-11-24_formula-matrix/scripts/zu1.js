const tryUrls = ['https://crm.zoho.com/crm/org946877290/settings/modules/Leads', 'https://crm.zoho.com/crm/org946877290/settings/modules'];
await page.goto(tryUrls[0], { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (!/Loading/.test(await page.innerText('body').catch(() => 'Loading'))) break; }
await sleep(3000); await page.screenshot({ path: RUN + '/zoho/u1.png' }); log('url', page.url()); log((await page.innerText('body')).slice(0, 800).replace(/\n+/g, ' | '));
