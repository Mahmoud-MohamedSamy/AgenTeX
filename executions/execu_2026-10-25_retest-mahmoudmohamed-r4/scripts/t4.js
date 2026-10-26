const fi = page.locator('input[value="Untitled Folder 1"]').first(); await fi.fill('QA RT Folder A'); await page.keyboard.press('Enter'); await sleep(800);
const row = page.getByText('QA RT Folder A').first().or(page.locator('input[value="QA RT Folder A"]').first()).first();
await row.hover(); await sleep(600);
const rowBtns = await page.evaluate(() => { const i = [...document.querySelectorAll('input')].find(x => x.value === 'QA RT Folder A') || [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Folder A'); let c = i; for (let k = 0; k < 5; k++) { c = c.parentElement; if (c.querySelectorAll('button').length > 1) break; } return [...c.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.title || b.innerText).trim()); });
await shot('ts-02-folder-hover');
return done({ rowBtns });
