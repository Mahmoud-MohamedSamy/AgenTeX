await page.mouse.click(60, 504); await page.waitForTimeout(2000); await shotZ(page, 'ac2-notif-sub');
out.sub = (await body(page)).replace(/\s+/g, ' ').match(/Notifications.{0,200}/g)?.slice(0, 3);
