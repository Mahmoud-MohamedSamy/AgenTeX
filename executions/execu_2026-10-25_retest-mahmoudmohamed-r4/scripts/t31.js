await page.goto(H + '/', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(1500);
await page.getByRole('button', { name: /QA RT TS/ }).first().click(); await sleep(1200);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio], [data-radix-popper-content-wrapper] *')].filter(e => e.childElementCount === 0).map(e => e.textContent.trim()).filter(Boolean));
await shot('1694-04-switcher');
await page.keyboard.press('Escape');
return done({ opts: [...new Set(opts)] });
