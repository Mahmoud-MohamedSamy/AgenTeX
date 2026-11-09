// Zoho read-only: dashboards list and one dashboard
const Z = 'https://crm.zoho.com/crm/org943261092';
const res = {};
const wait = async (p) => { for (let i = 0; i < 30; i++) { await sleep(2000); const t = await p.innerText('body').catch(() => ''); if (!/^\s*Loading/.test(t) && t.length > 300) break; } await sleep(3000); };
await zpage.goto(Z + '/tab/Dashboards', { waitUntil: 'domcontentloaded', timeout: 90000 }); await wait(zpage);
await shot('z-dashboards', zpage);
res.url = zpage.url(); res.text = (await zpage.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500);
return res;
