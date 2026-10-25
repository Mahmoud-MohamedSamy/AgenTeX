await page.keyboard.press('Escape'); await sleep(400);
const side = await page.evaluate(() => { const t = document.body.innerText; const i = t.search(/Unused|Removed|Existing Fields|Deleted/i); return i < 0 ? 'none' : t.slice(i, i + 400); });
const more = page.locator('header button, [class*=toolbar] button').filter({ hasText: '' });
return done({ side });
