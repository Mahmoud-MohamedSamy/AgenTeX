await page.mouse.click(599, 500); await sleep(700);
await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(1500);
await page.getByText('QA RT Folder A').first().click().catch(() => {}); await sleep(800);
const card = await page.evaluate(() => { const m = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Associate Modules to your Teamspace'); let c = m; for (let k = 0; k < 4; k++) c = c.parentElement; return c.innerText.slice(0, 400); });
await shot('ts-05-folder-filled');
return done({ card });
