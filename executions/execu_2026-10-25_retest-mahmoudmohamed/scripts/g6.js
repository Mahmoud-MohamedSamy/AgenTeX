const lab = page.getByText('QA RT Pick', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await lab.hover(); await sleep(600);
const opt = await page.evaluateHandle(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Pick'); let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; const b = c.querySelector('button[aria-label="Field options"]'); if (b) return b; } });
await opt.asElement().hover(); await opt.asElement().click(); await sleep(1000);
const items = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map(e => e.innerText.trim()));
if (items.includes('Edit Properties')) { await page.getByRole('menuitem', { name: 'Edit Properties' }).click(); await sleep(1500); }
const d = await page.evaluate(() => { const x = document.querySelector('[role=dialog]'); return x ? { text: x.innerText.slice(0, 700), btns: [...x.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).slice(0, 30), inputs: [...x.querySelectorAll('input')].map(i => (i.getAttribute('aria-label') || i.placeholder) + '=' + i.value).slice(0, 15) } : null; });
await shot('2120-01-props');
return done({ items, d });
