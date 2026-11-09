// NDC-2281: Leads › Filter › Owner options (read-only).
if (!/841043e1/.test(page.url())) await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 45000);
const fb = page.locator('button').filter({ hasText: /^Filter$/ }); const n = await fb.count();
await fb.first().click({ force: true, timeout: 10000 }); await sleep(2500); await shot('2281-01-filter-panel');
const t0 = (await txt()).split('\n').filter(l => l.trim()); const k = t0.findIndex(l => /Filter .* by/i.test(l));
return done({ n, url: page.url(), panel: t0.slice(k, k + 40) });
