// NDC-1864 step 1: switch QA RT partners off from the Modules and Fields list.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/modules-and-fields', 15000);
const row = page.locator('tr, [role=row], li, div').filter({ hasText: /^QA RT partners/ }).last();
const sw = page.locator('tr, [role=row]').filter({ hasText: 'QA RT partners' }).first().locator('[role=switch], input[type=checkbox], button[aria-pressed]');
const n = await sw.count(); const st0 = n ? await sw.first().getAttribute('aria-checked') : null;
if (n) { await sw.first().click({ force: true }); await sleep(3000); }
await shot('1864-01-toggled-off');
const st1 = n ? await sw.first().getAttribute('aria-checked') : null;
const toast = (await txt()).split('\n').filter(l => /module updated|disabled|success|error/i.test(l)).slice(0, 4);
const m = arr((await api('GET', '/modules')).j?.data).find(x => x.id === 'abf9acff-7f9d-4702-b28d-a7d1bbbbb1b2');
return done({ n, st0, st1, toast, apiStatus: m ? (m.status ?? m.isActive ?? m.enabled ?? JSON.stringify(m).slice(0, 200)) : 'not listed' });
