const lab = page.getByText('Probability (%)', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 120); await sleep(800);
const field = async name => { const l = page.getByText(name, { exact: true }).first(); const lb = await l.boundingBox(); const ins = page.locator('input:visible'); let best = null, bd = 1e9; for (let i = 0; i < await ins.count(); i++) { const b = await ins.nth(i).boundingBox(); if (!b) continue; const d = b.y - lb.y; if (d > 0 && d < 60 && Math.abs(b.x - lb.x) < 40 && d < bd) { bd = d; best = ins.nth(i); } } return best; };
const out = {};
for (const [n, v] of [['Probability (%)', '500'], ['Expected Revenue', '10000']]) { const f = await field(n); if (!f) { out[n] = 'no input under label'; continue; } const ro = await f.evaluate(x => ({ ro: x.readOnly, dis: x.disabled, aria: x.getAttribute('aria-readonly') })); await f.click({ force: true }).catch(() => {}); await page.keyboard.type(v).catch(() => {}); await sleep(400); out[n] = { ...ro, after: await f.inputValue() }; }
await shot('1823-03-prob-revenue');
return done(out);
