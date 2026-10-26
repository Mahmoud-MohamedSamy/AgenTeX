const onEdit = /Edit Teamspace/.test(await txt()); const name = await page.locator('input[value="QA RT TS"]').count();
await page.evaluate(() => window.scrollTo(0, 0)); await page.mouse.move(973, 160); await sleep(400);
const btn = await page.evaluate(() => { const e = document.elementFromPoint(973, 160); const b = e?.closest('button'); return b ? (b.getAttribute('aria-label') || b.title || 'button') : (e?.tagName || null); });
await page.mouse.click(973, 160); await sleep(1500);
const dlg = await page.evaluate(() => (document.querySelector('[role=alertdialog],[role=dialog]') || {}).innerText?.slice(0, 400) || null);
await shot('1689-01-edit-page-trash');
return done({ onEdit, name, btn, dlg });
