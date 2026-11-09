await page.mouse.click(1527, 206); await sleep(1500);
out.menu = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,30}(Upload File|Documents|WorkDrive|Cloud).{0,200}/i)?.[0];
await page.screenshot({ path: RAW + 'z-attach-menu2.png' });
await page.keyboard.press('Escape');
