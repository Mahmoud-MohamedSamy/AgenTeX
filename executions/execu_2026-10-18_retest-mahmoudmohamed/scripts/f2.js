// NDC-1819 functional pass: inspect the column menu items' roles, and header state after reload.
const out = {};
await sleep(4000); out.heads = (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean);
await page.getByRole('button', { name: 'Column options: Full Name' }).click(); await sleep(1000);
out.items = await page.locator('[role=menu] *').evaluateAll(es => es.filter(e => e.getAttribute('role') || e.tagName === 'BUTTON').map(e => e.tagName + '|' + e.getAttribute('role') + '|' + (e.innerText || '').trim().slice(0, 30) + '|' + (e.getAttribute('aria-disabled') || '')).slice(0, 15));
await page.keyboard.press('Escape');
return done(out);
