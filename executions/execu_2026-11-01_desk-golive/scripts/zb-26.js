const b = page.locator('input[type=button][value=Merge]').filter({ visible: true }); out.n = await b.count();
if (out.n) await b.last().click(); else await page.getByText('Merge', { exact: true }).last().click();
await page.waitForTimeout(3000); out.confirm = (await body(page)).slice(-400); await shotZ(page, 'merge-2');
