await page.getByText('Forward', { exact: true }).first().click(); await page.waitForTimeout(5000);
out.f1 = (await body(page)).replace(/\s+/g, ' ').match(/Forward.{0,500}/)?.[0]; await shotZ(page, 'ac2-y4-forward');
await page.keyboard.type('qa-ac2-ext@example.com'); await page.waitForTimeout(3000);
out.f2 = (await body(page)).replace(/\s+/g, ' ').match(/.{0,200}qa-ac2-ext.{0,300}/)?.[0]; await shotZ(page, 'ac2-y4-forward-ext');
