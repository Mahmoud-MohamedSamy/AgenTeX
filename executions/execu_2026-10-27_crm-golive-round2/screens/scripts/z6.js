await page.mouse.click(837, 135); await sleep(1500);
out.menu = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,40}(Asc|Pin Column|Hide Column).{0,200}/)?.[0];
await page.screenshot({ path: RAW + 'z-wq-colmenu.png' });
await page.keyboard.press('Escape'); await sleep(600);
await page.mouse.click(1563, 135); await sleep(1500);
out.tableSettings = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,40}(Manage Columns|Reset Column).{0,200}/)?.[0];
await page.screenshot({ path: RAW + 'z-wq-tablesettings.png' }); await page.keyboard.press('Escape');
