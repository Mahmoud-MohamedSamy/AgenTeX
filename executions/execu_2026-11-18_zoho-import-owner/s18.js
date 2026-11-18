await page.locator('[data-id="findByField_textBox"]').first().click(); await page.waitForTimeout(2000);
out.idopts = (await page.locator('li:visible').allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
await page.keyboard.press('Escape');
