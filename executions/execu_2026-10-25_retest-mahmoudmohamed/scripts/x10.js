let tr = null; for (let k = 0; k < 40; k++) { await sleep(1000); tr = (await txt()).match(/Total Records ([1-9]\d*)/); if (tr) break; }
await sleep(1500);
const out = { total: tr && tr[1] };
out.rail = (await page.locator('button, [role=tab], a').evaluateAll(es => es.map(e => e.innerText.trim()).filter(t => /^([A-Z]|All|#)$/.test(t)))).join(' ');
out.rows = (await page.locator('tbody tr').allInnerTexts()).map(r => r.replace(/\s+/g, ' ').trim().slice(0, 60));
await shot('1819-10-az-rail');
return done(out);
