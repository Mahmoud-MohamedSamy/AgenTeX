const st = page.getByText('Stage', { exact: true }).first(); await st.scrollIntoViewIfNeeded(); await sleep(500);
const sb = await st.boundingBox(); await page.mouse.click(sb.x + 200, sb.y + 32); await sleep(800);
await page.getByRole('option', { name: /^Qualification$/i }).first().click({ force: true }).catch(async () => { await page.getByText(/^Qualification$/i).last().click({ force: true }); }); await sleep(800);
const am = page.getByText('Amount', { exact: true }).first(); const ab = await am.boundingBox(); await page.mouse.click(ab.x + 200, ab.y + 32); await page.keyboard.type('10000'); await page.keyboard.press('Tab'); await sleep(1200);
await page.getByText('Probability (%)', { exact: true }).first().scrollIntoViewIfNeeded(); await sleep(600); await shot('1823-04-autofill');
const vals = await page.evaluate(() => { const g = n => { const l = [...document.querySelectorAll('label, div, span')].find(e => e.childElementCount <= 2 && e.textContent.trim().startsWith(n)); const i = l && l.parentElement && l.parentElement.querySelector('input'); return i ? i.value || i.placeholder : null; }; return { prob: g('Probability (%)'), er: g('Expected Revenue') }; });
return done(vals);
