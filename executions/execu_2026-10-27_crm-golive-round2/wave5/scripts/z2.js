const Z = 'https://crm.zoho.com/crm/org943261092';
const res = {};
await zpage.goto(Z + '/tab/Analytics', { waitUntil: 'domcontentloaded', timeout: 90000 });
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await zpage.innerText('body').catch(() => ''); if (!/Loading\.\.\./.test(t.slice(-200)) && t.length > 600) break; }
await sleep(4000);
await shot('z-analytics', zpage);
res.url = zpage.url(); res.text = (await zpage.innerText('body')).replace(/\s+/g, ' ').slice(300, 2200);
return res;
