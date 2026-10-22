return done({ d: await page.locator('[role=dialog]').allInnerTexts(), s: await shot('l3') });
