const fs = require('fs'); const out = [];
page.on('response', async r => { const u = r.url(); if (!/\/api\/v1\/desk\//.test(u) || /notifications|presence|tab-settings|preferences|sandboxes|integrations|send-as/.test(u)) return; let b = ''; try { b = (await r.text()).slice(0, 5000); } catch (e) {} out.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, ''), s: r.status(), b }); });
await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if (/Round Robin Rules|Preferences/.test(await text())) break; }
await sleep(5000); await shot('2275-a2-rr.png', { fullPage: true }); const t1 = await text();
const pref = page.getByRole('button', { name: /Preferences/ }).first(); let t2 = '';
if (await pref.count()) { await pref.click(); await sleep(5000); await shot('2275-a3-prefs.png'); t2 = await text(); await page.keyboard.press('Escape'); await sleep(1000); }
await page.getByRole('tab', { name: 'Team Assignment' }).first().click().catch(() => page.getByText('Team Assignment', { exact: true }).first().click()); await sleep(6000); await shot('2275-a4-team.png', { fullPage: true }); const t3 = await text();
await page.getByRole('tab', { name: 'Notifications' }).first().click().catch(() => page.getByText('Notifications', { exact: true }).last().click()); await sleep(6000); await shot('2275-a5-notif.png', { fullPage: true }); const t4 = await text();
fs.writeFileSync(require('path').join(process.cwd(), '..', '2275-net2.json'), JSON.stringify(out, null, 1));
const cut = t => t.slice(t.indexOf('Assignment Rules\n\n') + 1, t.indexOf('Assignment Rules\n\n') + 2200);
return { rr: cut(t1), prefs: t2.slice(t2.indexOf('Preferences'), t2.indexOf('Preferences') + 1500), team: cut(t3), notif: cut(t4), calls: out.map(x => x.m + ' ' + x.s + ' ' + x.u.slice(0, 160)) };
