const off = capOn(); const out = {};
await go('/settings/automation/workflow-rules', 4000);
for (let i = 0; i < 40; i++) { if ((await txt()).includes('USER MANAGEMENT')) break; await sleep(1000); }
out.hrefs = await page.$$eval('a', as => as.map(a => a.textContent.trim() + '=' + a.getAttribute('href')).filter(s => /role|profile/i.test(s)));
await page.getByText('Roles', { exact: true }).first().click(); await sleep(7000);
out.url = page.url(); const t = await txt(); out.main = t.slice(t.indexOf('Desk Integration') + 16).slice(0, 1500);
await shot('NDC-2204-desk-roles-page');
out.calls = cap.filter(c => /role|profile/i.test(c));
off(); return done(out);
