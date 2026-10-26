await page.getByRole('button', { name: 'Create Folder' }).click(); await sleep(1200);
const after1 = await page.evaluate(() => { const m = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Modules'); let c = m; for (let k = 0; k < 4; k++) c = c.parentElement; return c.innerText.slice(0, 400); });
const inputs = await page.evaluate(() => [...document.querySelectorAll('input')].filter(i => i.offsetParent).map(i => (i.getAttribute('aria-label') || i.placeholder) + '=' + i.value));
const btns = await page.evaluate(() => [...document.querySelectorAll('button[aria-label]')].filter(b => b.offsetParent).map(b => b.getAttribute('aria-label')).filter(a => /folder|module|rename|delete|menu/i.test(a)));
await shot('ts-01-folder');
return done({ after1, inputs, btns });
