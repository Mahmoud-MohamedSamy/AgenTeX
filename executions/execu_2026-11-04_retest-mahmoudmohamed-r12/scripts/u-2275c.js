const fs = require('fs'); const out = []; const js = [];
page.on('response', async r => { const u = r.url(); if (/assets\/.*\.js$/.test(u)) js.push(u); if (!/\/api\/v1\/desk\//.test(u) || /notifications|presence|tab-settings|preferences$|sandboxes|integrations|send-as/.test(u)) return; let b = ''; try { b = (await r.text()).slice(0, 5000); } catch (e) {} out.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, ''), s: r.status(), b }); });
await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if (/Round Robin Rules/.test(await text())) break; }
await sleep(3000);
// ⋮ next to department selector
const btns = page.locator('button:right-of(:text("Department"))'); 
await page.locator('main button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).nth(0).count();
const more = page.getByRole('button', { name: /more|options|actions|menu/i });
const n = await more.count(); log('more buttons', n);
if (n) { await more.first().click(); await sleep(1500); log('menu', (await page.locator('[role=menu]').innerText().catch(() => ''))); }
const pi = page.getByRole('menuitem', { name: /Preferences/ }); if (await pi.count()) { await pi.first().click(); await sleep(5000); }
await shot('2275-a3-prefs.png'); const t2 = await text();
fs.writeFileSync(require('path').join(process.cwd(), '..', '2275-net3.json'), JSON.stringify({ out, js }, null, 1));
return { prefs: t2.slice(t2.lastIndexOf('Preferences') - 200, t2.lastIndexOf('Preferences') + 2500), calls: out.map(x => x.m + ' ' + x.s + ' ' + x.u.slice(0, 160)) };
