const res = {};
await zpage.goto('https://crm.zoho.com/crm/org943261092/tab/Home/begin', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
await zpage.locator('text=/^Analytics$/').first().click().catch(e => res.err = e.message.slice(0, 80));
for (let i = 0; i < 25; i++) { await sleep(2000); const t = await zpage.innerText('body').catch(() => ''); if (t.length > 800 && !/Loading\.\.\.\s*$/.test(t)) break; }
await sleep(4000);
await shot('z-analytics', zpage);
res.url = zpage.url(); const t = (await zpage.innerText('body')).replace(/\s+/g, ' '); res.text = t.slice(t.indexOf('Invoices') + 8, t.indexOf('Invoices') + 1800);
return res;
