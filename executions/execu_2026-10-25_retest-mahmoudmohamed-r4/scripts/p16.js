const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goBack(); for (let k = 0; k < 60; k++) { await sleep(1000); if (/[1-9]\d* records/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const idx = await page.evaluate(() => [...document.querySelectorAll('thead th')].findIndex(t => t.innerText.trim() === 'Pipeline'));
const row = page.locator('tbody tr').filter({ hasText: 'QA RT 1302 move' }).first();
const cell = row.locator('td').nth(idx); await cell.scrollIntoViewIfNeeded(); await cell.hover(); await sleep(700);
const inner = await cell.evaluate(c => ({ html: c.innerHTML.slice(0, 400), btns: [...c.querySelectorAll('button,[role=button]')].map(b => b.getAttribute('aria-label') || b.innerText) }));
const rowBtns = await row.evaluate(r => [...r.querySelectorAll('button,[role=button]')].map(b => b.getAttribute('aria-label') || b.title || b.innerText).filter(Boolean));
await shot('1324-02-hover');
return done({ idx, inner, rowBtns });
