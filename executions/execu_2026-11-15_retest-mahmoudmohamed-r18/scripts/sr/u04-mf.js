const out = {};
await go('/settings/modules-and-fields/' + MID, 9000);
out.tabs = await page.getByRole('tab').allInnerTexts();
const t = page.getByRole('tab', { name: /^Fields/ }); if (await t.count()) { await t.first().click(); await sleep(4000); }
out.url = page.url();
const row = page.locator('tr, [role=row]').filter({ hasText: /QA RT18SR NUM/ }).first(); out.row = await row.innerText().catch(() => 'none');
out.rowBtns = await row.locator('button').evaluateAll(e => e.map(x => x.getAttribute('aria-label') || x.innerText)).catch(() => []);
await shot('2935-0-fields.png');
return out;
