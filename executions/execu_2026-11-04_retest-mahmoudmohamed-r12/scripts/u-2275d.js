const fs = require('fs'); const out = [];
page.on('response', async r => { const u = r.url(); if (!/\/api\/v1\//.test(u) || /iam\/|notifications|presence|tab-settings|sandboxes|integrations|send-as|settings\/resolved/.test(u)) return; let b = ''; try { b = (await r.text()).slice(0, 6000); } catch (e) {} out.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, ''), s: r.status(), b }); });
await page.goto(H + '/tickets/93a752f5-ca5b-4e5c-ad0f-0bbb79171848', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2275 SEQ 1/.test(await text())) break; } await sleep(4000);
const h = page.getByRole('tab', { name: /History/ }); if (await h.count()) { await h.first().click(); } else { await page.getByText('History', { exact: true }).first().click().catch(() => {}); }
await sleep(8000); await shot('2275-b1-history-seq1.png');
fs.writeFileSync(require('path').join(process.cwd(), '..', '2275-net4.json'), JSON.stringify(out, null, 1));
const t = await text(); return { hist: t.slice(t.indexOf('History'), t.indexOf('History') + 2500), calls: out.map(x => x.m + ' ' + x.s + ' ' + x.u.slice(0, 150)) };
