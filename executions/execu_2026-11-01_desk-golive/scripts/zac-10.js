await page.mouse.click(745, 217); await page.waitForTimeout(2500);
out.t = (await body(page)).match(/Department.{0,300}/)?.[0]; await shotZ(page, 'ac-ag2-newticket-dept');
