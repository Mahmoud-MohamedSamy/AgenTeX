await page.keyboard.press('Escape'); await page.waitForTimeout(800); out.ok = !(await body(page)).includes('MOVE DEPARTMENT');
