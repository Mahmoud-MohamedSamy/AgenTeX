await go('/settings/organization/departments', 7000);
await page.getByRole('button', { name: /Add department/ }).click(); await sleep(3000);
const s = await shot('dept-new-form');
const t = (await txt()).replace(/\s+/g, ' ');
const ins = await page.locator('input:visible, textarea:visible, select:visible, [role=combobox]:visible, [role=switch]:visible').evaluateAll(es => es.map(e => e.tagName + ':' + (e.type || e.getAttribute('role') || '') + ':' + (e.placeholder || e.name || e.getAttribute('aria-label') || '')));
rec('DEPT.form', 'INFO', `url ${page.url().replace(H, '')}; inputs ${ins.join(', ').slice(0, 600)}; text ${t.slice(t.indexOf('Add department'), t.indexOf('Add department') + 700)}`, { shot: s });
return done();
