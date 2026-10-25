const out = {};
for (const tab of ['VALIDATION', 'ADVANCED']) { await page.getByText(tab, { exact: true }).click(); await sleep(1000); out[tab] = await page.evaluate(() => { const p = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Field Properties'); let c = p; for (let k = 0; k < 6; k++) c = c.parentElement; return c.innerText.slice(0, 700); }); if (/QA RT opt/.test(out[tab])) { await shot('2120-02-options-' + tab); break; } }
return done(out);
