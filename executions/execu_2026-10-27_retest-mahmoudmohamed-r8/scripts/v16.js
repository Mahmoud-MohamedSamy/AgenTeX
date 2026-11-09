const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {}; const reqs = [];
page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST', 'PUT'].includes(q.method()) && /records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 160); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 90) + ' ' + (q.postData() || '').slice(0, 300) + ' => ' + b); } });
await page.setViewportSize({ width: 1700, height: 900 });
await go(`/modules/${D}`, 5000); for (let j = 0; j < 75 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(2000);
const rb = await page.getByText('QA RT r8 deal', { exact: true }).first().boundingBox(); const hb = await page.getByText('Pipeline', { exact: true }).first().boundingBox();
await page.mouse.move(hb.x + 40, rb.y + rb.height / 2); await sleep(800);
const pens = page.locator('button:visible, [role=button]:visible'); let best = null, bd = 1e9;
for (let i = 0; i < await pens.count(); i++) { const bb = await pens.nth(i).boundingBox(); if (!bb) continue; const dy = Math.abs(bb.y + bb.height / 2 - (rb.y + rb.height / 2)); const dx = bb.x - hb.x; if (dy < 15 && dx > 0 && dx < 140 && dy < bd) { bd = dy; best = pens.nth(i); } }
out.pencil = !!best; if (best) { await best.click(); await sleep(3000); }
await shot('v16-inline-edit');
out.ui = (await txt()).split('\n').map(l => l.trim()).filter(l => /Change pipeline|New pipeline|Stage in the new|Standard \(|^1$|test-0|Cancel/i.test(l)).slice(0, 14);
return done({ ...out, reqs });
