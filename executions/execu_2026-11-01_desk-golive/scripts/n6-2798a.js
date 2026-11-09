const o = {};
await page.goto(H + '/settings/customization/notifications', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Team Notifications/.test(t) && !/Loading notification rules/.test(t)) break; }
const sel = page.locator('select').first(); await sel.selectOption({ label: 'QA NDC Quality Assurance' }).catch(e => o.e = e.message.slice(0, 60)); await sleep(4000);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Team Notifications'); const sec = t.slice(i, i + 5000);
o.team = [...sec.matchAll(/([A-Z][a-z]+ing [a-zA-Z ]{3,40}?) (Notifies|Tells)/g)].map(m => m[1]);
await page.setViewportSize({ width: 1600, height: 2400 }); await sleep(800);
await page.locator('text=/^Team Notifications$/').first().evaluate(e => e.scrollIntoView({ block: 'start' })).catch(() => {}); await sleep(1000);
o.shot = await shot('rt/2798-team-notif-on'); await page.setViewportSize({ width: 1600, height: 900 });
return JSON.stringify(o);
