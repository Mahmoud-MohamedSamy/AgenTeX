const ov = await page.evaluate(() => { const o = document.querySelector('.ce-overlay-backdrop-enter'); return o ? o.innerText.slice(0, 800) : null; });
await shot('2113-00-overlay');
return done({ ov });
