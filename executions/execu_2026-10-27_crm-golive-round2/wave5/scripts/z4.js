const res = {};
await zpage.goto('https://crm.zoho.com/crm/org943261092/tab/Reports', { waitUntil: 'domcontentloaded', timeout: 90000 });
for (let i = 0; i < 25; i++) { await sleep(2000); const t = await zpage.innerText('body').catch(() => ''); if (t.length > 800 && !/Loading\.\.\.\s*$/.test(t)) break; }
await sleep(3000); await shot('z-reports-list', zpage);
const t = (await zpage.innerText('body')).replace(/\s+/g, ' '); res.text = t.slice(t.indexOf('Invoices') + 8, t.indexOf('Invoices') + 1500);
res.tour = /Next|Got it|Skip/.test(t.slice(-400));
return res;
