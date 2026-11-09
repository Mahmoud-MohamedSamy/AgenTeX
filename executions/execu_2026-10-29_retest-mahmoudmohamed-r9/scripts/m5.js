const out = {}; const reqs = []; page.on('request', r => { if (['PUT', 'POST', 'PATCH'].includes(r.method()) && r.url().includes('/layouts')) reqs.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 700)); });
for (let i = 0; i < 30 && !(await txt()).includes('QA RT r8 layout'); i++) await sleep(2000);
const row = page.getByText('QA RT r8 layout', { exact: true }).first(); await row.scrollIntoViewIfNeeded(); const rb = await row.boundingBox(); out.rb = rb;
await page.mouse.move(rb.x + 600, rb.y + 5); await sleep(800); await shot('m5-row-hover');
const btns = page.locator('button:visible'); const near = []; for (let i = 0; i < await btns.count(); i++) { const bb = await btns.nth(i).boundingBox(); if (bb && Math.abs(bb.y - rb.y) < 25) near.push({ i, x: Math.round(bb.x), label: (await btns.nth(i).getAttribute('aria-label')) || (await btns.nth(i).innerText()).slice(0, 30) }); }
out.near = near;
const last = near.sort((a, b) => b.x - a.x)[0]; if (last) { await btns.nth(last.i).click(); await sleep(1200); out.menu = (await page.locator('[role=menuitem]').allInnerTexts()); await shot('m5-menu'); }
out.reqs = reqs; return done(out);
