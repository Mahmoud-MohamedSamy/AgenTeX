await page.reload({ waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (t.includes('Unaccounted') && t.includes('QA RT 2113 a')) break; }
await sleep(2000);
const info = await page.evaluate(() => { const hs = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && /^(Unaccounted|Qualification|Proposal)$/.test(e.textContent.trim())); return hs.map(h => { let c = h; for (let k = 0; k < 8; k++) { c = c.parentElement; if (c.getBoundingClientRect().height > 300) break; } const r = c.getBoundingClientRect(); return { name: h.textContent.trim(), x: Math.round(r.left), w: Math.round(r.width), cards: (c.innerText.match(/QA RT 2113 [ab]/g) || []), hint: c.getAttribute('title') || c.querySelector('[title]')?.getAttribute('title') || '', create: /Create Transactions/.test(c.innerText) }; }); });
return done(info);
