const off = capOn(); const out = {};
await go('/settings/users-control/roles', 4000);
for (let i = 0; i < 30; i++) { if ((await txt()).includes('HIERARCHY')) break; await sleep(1000); }
await sleep(2000);
const ea = page.getByText('Expand all', { exact: true }); if (await ea.count()) { await ea.first().click(); await sleep(2000); }
const t = await txt(); out.main = t.slice(t.indexOf('HIERARCHY')).slice(0, 800);
await shot('NDC-2204-desk-roles-page');
out.calls = cap.filter(c => !/iam\/me|nav_tabs|crm\/status|send-as-email|settings\/hub|resolved/.test(c));
off(); return done(out);
