await page.mouse.click(78, 497); await sleep(2000);
const cur = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).find(t => /Teamspace|QA RT TS/.test(t)));
await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(800);
await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(3000);
const r = await page.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT TS' && e.getBoundingClientRect().left > 300); let c = h; for (let k = 0; k < 6; k++) { c = c.parentElement; const b = c.querySelector('button'); if (b) { const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, label: b.getAttribute('aria-label') || b.title || '' }; } } });
await page.mouse.click(r.x, r.y); await sleep(1500);
const dlg = await page.evaluate(() => (document.querySelector('[role=alertdialog],[role=dialog]') || {}).innerText?.slice(0, 400) || null);
await shot('1689-01-edit-page-trash');
return done({ cur, trash: r, dlg });
