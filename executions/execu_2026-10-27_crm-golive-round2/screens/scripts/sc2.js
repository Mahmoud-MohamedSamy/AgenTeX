await page.locator('body').click({ position: { x: 800, y: 700 } });
await page.keyboard.press('Control+k'); await sleep(800); await page.keyboard.type('Reports'); await sleep(1500); await page.keyboard.press('Enter'); await sleep(2500);
out.afterEnter = page.url().replace(B, '');
await page.keyboard.press('Control+k'); await sleep(800); await page.keyboard.type('New Tasks'); await sleep(1500); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter'); await sleep(2500);
out.afterNewTask = page.url().replace(B, '');
// on a list page: does Ctrl+K still work and does '?' work
await page.goto(B + '/dashboards', { waitUntil: 'domcontentloaded' }); await sleep(4000);
await page.locator('body').click({ position: { x: 800, y: 700 } }); await page.keyboard.press('Shift+Slash'); await sleep(800);
out.helpOnDashboards = (await page.$$eval('[role=dialog]', es => es.length)); await page.keyboard.press('Escape');
