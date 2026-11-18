out.rowsChecked = await page.locator('text=/^QA GL TM zoho [23]$/').count();
await page.getByText('Merge', { exact: true }).first().click(); await page.waitForTimeout(6000);
out.url = page.url().slice(-80); out.merge = (await body(page)).slice(0, 900); await shotZ(page, 'merge-1');
