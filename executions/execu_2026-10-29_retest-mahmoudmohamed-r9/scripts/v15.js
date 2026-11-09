const out = {}; const reqs = []; page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST', 'PUT'].includes(q.method()) && /records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 160); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 90) + ' ' + (q.postData() || '').slice(0, 300) + ' => ' + b); } });
const lab = await page.getByText('PIPELINE', { exact: true }).last().boundingBox();
const pens = page.locator('button:visible'); let best = null, bd = 1e9; for (let i = 0; i < await pens.count(); i++) { const bb = await pens.nth(i).boundingBox(); if (!bb) continue; const d = Math.abs(bb.y - lab.y - 20); if (bb.x > 1500 && d < 40 && d < bd) { bd = d; best = pens.nth(i); } }
if (best) { await best.click(); await sleep(2500); } out.clicked = !!best; await shot('v15-pipeline-edit');
out.ui = (await txt()).split('\n').filter(l => /Change pipeline|New pipeline|Stage in the new|pipeline|Select/i.test(l)).slice(0, 12);
return done({ ...out, reqs });
