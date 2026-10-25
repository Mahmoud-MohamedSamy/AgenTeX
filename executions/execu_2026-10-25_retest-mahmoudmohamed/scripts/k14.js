const pick = async (i, name) => { const b = page.getByRole('button', { name: 'Criteria field' }).nth(i); await b.click(); await sleep(1000); const id = await b.getAttribute('aria-controls'); await page.locator(`#${id}`).getByText(name, { exact: true }).first().click(); await sleep(1500); };
await page.getByRole('button', { name: 'Add criteria row' }).first().click(); await sleep(1000);
await pick(1, 'Multi-Select Lookup Permission');
await page.getByRole('button', { name: 'Choose a record for Multi-Select Lookup Permission' }).click(); await sleep(1500);
const d = page.getByRole('dialog');
await d.getByLabel('Select test365 123').click(); await d.getByLabel('Select Mahmoud Samy').click(); await sleep(300);
const both = { Y: await d.getByLabel('Select test365 123').isChecked(), S: await d.getByLabel('Select Mahmoud Samy').isChecked() };
await d.getByRole('button', { name: 'Select', exact: true }).click(); await sleep(1200);
const overlap = () => page.evaluate(() => { const rows = [...document.querySelectorAll('#main-content button[aria-label="Remove criteria row"]')].map(rm => { let r = rm; for (let k = 0; k < 6; k++) { r = r.parentElement; if (r.querySelector('button[aria-label="Criteria field"]')) break; } const ctl = [...r.querySelectorAll('button, input, [class*=chip], span')].filter(e => !/criteria row/.test(e.getAttribute('aria-label') || '') && !e.closest('button[aria-label*="criteria row"]')); const btns = [...r.querySelectorAll('button[aria-label$="criteria row"]')].map(b => b.getBoundingClientRect()); const hit = ctl.filter(e => { const a = e.getBoundingClientRect(); if (!a.width) return false; return btns.some(b => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1); }).map(e => (e.getAttribute('aria-label') || e.innerText || e.tagName).slice(0, 40)); const ov = ctl.filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow === 'visible').length; return { field: r.querySelector('button[aria-label="Criteria field"]')?.innerText, hit, rowW: Math.round(r.getBoundingClientRect().width), text: r.innerText.replace(/\n/g, ' / ').slice(0, 120) }; }); return rows; });
const out = { both };
for (const w of [1280, 1024, 800]) { await page.setViewportSize({ width: w, height: 800 }); await sleep(900); out['w' + w] = await overlap(); await page.locator('button[aria-label="Remove criteria row"]').first().scrollIntoViewIfNeeded(); await shot('2101-06-rows-' + w); }
await page.setViewportSize({ width: 1280, height: 720 }); await sleep(500);
return done(out);
