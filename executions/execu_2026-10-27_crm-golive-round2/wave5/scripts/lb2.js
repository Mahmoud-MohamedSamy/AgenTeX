await page.locator('text=Unused Fields').first().click(); await sleep(1500);
await shot('lb-unused');
const items = await page.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Unused Fields'); let p = h; for (let i = 0; i < 4; i++) p = p.parentElement; return p.innerText.replace(/\s+/g, ' ').slice(0, 600); });
return { items };
