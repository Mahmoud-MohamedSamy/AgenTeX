const out = {};
await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT20 BS Contract/.test(await text())) break; }
out.btns = await page.getByRole('button').evaluateAll(es => es.map(e => (e.innerText.trim() || e.getAttribute('aria-label') || '')).filter(x => x && x.length < 40).slice(0, 50));
out.links = await page.locator('a').evaluateAll(es => es.map(e => e.getAttribute('href')).filter(h => /new|create/i.test(h || '')));
await shot('2841-0-contracts.png');
return out;
