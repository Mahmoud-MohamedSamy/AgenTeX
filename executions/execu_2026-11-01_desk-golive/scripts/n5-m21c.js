const o = {};
await page.goto(H + '/settings/customization/notifications', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Team Notifications/.test(t)) break; }
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Agent Notifications'); const j = t.indexOf('Department Notifications');
o.agent = [...t.slice(i, j).matchAll(/([A-Z][a-z]+ing [a-zA-Z ]{3,40}?) (Notifies|Tells)/g)].map(m => m[1]);
return JSON.stringify(o);
