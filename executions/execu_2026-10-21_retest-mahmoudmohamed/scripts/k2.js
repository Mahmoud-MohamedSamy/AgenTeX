await page.getByRole('button', { name: /All Users/ }).click(); await sleep(1200);
await page.getByPlaceholder(/Search users/).fill('test user 1'); await sleep(1500);
await page.getByText('test user 1', { exact: true }).last().click(); await sleep(800);
const ap = page.getByRole('button', { name: /Apply/ }); if (await ap.count()) { await ap.first().click(); }
await page.keyboard.press('Escape'); await sleep(4000);
const rows = await page.locator('tbody tr').allInnerTexts();
await shot('1422-02-test-user-1');
return done({ rows: rows.slice(0, 4) });
