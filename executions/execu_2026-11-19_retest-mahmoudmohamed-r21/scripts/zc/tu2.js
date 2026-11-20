await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/00645a02-40cc-4a7e-9f8d-4a1446829857', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT20 ZC Contract 2841/.test(await text())) break; } await sleep(3000);
const d = page.getByText('Department', { exact: true }).first(); await d.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1200);
const bb = await d.boundingBox(); await shot('ZC-2841-tavi-2-record-dept.png'); const out = { bb };
await page.mouse.click(1569, 97); await sleep(1500); const items = await page.locator('[role=menuitem]').allInnerTexts(); out.menu = items;
const ed = page.getByRole('menuitem', { name: /^Edit$/ }); if (await ed.count()) { await ed.first().click(); await sleep(5000);
  const dl = page.getByText('Department', { exact: true }).first(); await dl.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1000); out.editBB = await dl.boundingBox(); await shot('ZC-2841-tavi-3-edit-form.png');
  out.deptCtl = await page.locator('xpath=//*[normalize-space(text())="Department"]/following::*[self::button or @role="combobox" or self::select][1]').first().evaluate(e => e.tagName + ' disabled=' + (e.disabled || e.getAttribute('aria-disabled')) + ' ' + (e.innerText || e.value)).catch(e => 'ERR');
  out.planCtl = await page.locator('xpath=//*[normalize-space(text())="Support Plan"]/following::*[self::button or self::input or @role="combobox"][1]').first().evaluate(e => e.tagName + ' disabled=' + (e.disabled || e.getAttribute('aria-disabled')) + ' ' + (e.innerText || e.value)).catch(e => 'ERR');
  out.err = (await text()).replace(/\s+/g, ' ').match(/(This plan belongs|another department)[^.]{0,160}\./g); }
return out;
