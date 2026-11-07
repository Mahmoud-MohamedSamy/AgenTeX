const fs = require('fs'); const out = []; 
page.on('response', async r => { const u = r.url(); if (!/\/api\/v1\//.test(u) || /iam\/auth|notifications/.test(u)) return; let b = ''; try { b = (await r.text()).slice(0, 4000); } catch (e) {} out.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, ''), s: r.status(), b }); });
await page.goto(H + '/settings/automation/assignment-rules', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if (/Direct Assignment|Round Robin/.test(await text())) break; }
await sleep(5000); await shot('2275-a1-rules.png', { fullPage: true });
const t1 = await text();
fs.writeFileSync(require('path').join(process.cwd(), '..', '2275-net.json'), JSON.stringify(out, null, 1));
return { url: page.url(), text: t1.slice(0, 2500), calls: out.map(x => x.m + ' ' + x.s + ' ' + x.u.slice(0, 160)) };
