await go('/settings/organization/products', 12000); await sleep(2000);
await page.getByRole('button', { name: 'New Product' }).click(); await sleep(3500);
await page.getByLabel('Product Name').fill('QA GL W5 Ev Product'); await page.getByLabel('Product Code').fill('QA-GL-W5-EV');
const n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(1500);
await shot('w5/W5-60-save-error'); await sleep(2500);
out.net = NET.slice(n0).filter(x => /records/.test(x.u)).map(x => x.m + ' ' + x.s + ' ' + x.t.slice(0, 200));
out.msg = (await page.locator('[role=alert], [data-sonner-toast], [class*=toast], [class*=error]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 400);
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'product', id: m[1], name: 'QA GL W5 Ev Product', mod: PM }); out.pid = m[1]; }
const dep = page.getByText('Departments', { exact: false }).last(); if (await dep.count()) { await dep.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('w5/W5-60-save-error-field'); }
out.fieldTxt = (await mtxt()).match(/.{0,120}not a valid department.{0,80}/)?.[0];
return fin({ out });
