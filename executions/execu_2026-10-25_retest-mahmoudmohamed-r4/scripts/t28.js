const open = async () => { await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(800); await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(3000); };
await open();
const r = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Folder B'); let c = el; for (let k = 0; k < 5; k++) { c = c.parentElement; const bs = c.querySelectorAll('button'); if (bs.length) { const b = bs[bs.length - 1]; const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2 }; } } });
await page.mouse.click(r.x, r.y); await sleep(1500);
const dlg = await page.evaluate(() => (document.querySelector('[role=alertdialog],[role=dialog]') || {}).innerText?.slice(0, 700) || null);
const btns = await page.evaluate(() => [...(document.querySelector('[role=alertdialog],[role=dialog]') || document).querySelectorAll('button, input[type=radio], label')].map(b => (b.innerText || b.value || b.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 15));
await shot('1692-03-delete-folder-dialog');
return done({ dlg, btns });
