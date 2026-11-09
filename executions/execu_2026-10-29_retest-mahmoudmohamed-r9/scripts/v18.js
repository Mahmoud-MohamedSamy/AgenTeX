const out = {}; const reqs = [];
page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST', 'PUT'].includes(q.method()) && /mass|records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 90) + ' ' + (q.postData() || '').slice(0, 300) + ' => ' + b); } });
const rb = await page.getByText('QA RT r8 deal', { exact: true }).first().boundingBox();
const cbs = page.locator('input[type=checkbox]:visible'); let cb = null; for (let i = 0; i < await cbs.count(); i++) { const bb = await cbs.nth(i).boundingBox(); if (bb && Math.abs(bb.y + bb.height / 2 - (rb.y + rb.height / 2)) < 12) { cb = cbs.nth(i); break; } }
await cb.check(); await sleep(1500); await shot('v18-selected');
out.bar = (await txt()).split('\n').filter(l => /selected|Mass|Update|Actions/i.test(l)).slice(0, 8);
const mu = page.getByRole('button', { name: /Mass Update/i }).first(); if (await mu.count()) await mu.click(); else { const more = page.getByRole('button', { name: /Actions|More/i }).first(); await more.click(); await sleep(800); await page.getByText(/Mass Update/i).first().click(); }
await sleep(2500); await page.getByText(/Choose a field/i).first().click().catch(() => {}); await sleep(1200);
const search = page.locator('input[placeholder*="earch"]:visible').last(); if (await search.count()) { await search.fill('pipe'); await sleep(1200); }
out.fieldOptions = (await page.locator('[role=option]').allInnerTexts()).slice(0, 8);
await page.locator('[role=option]').filter({ hasText: /^Pipeline$/ }).first().click().catch(e => out.pickErr = String(e.message).slice(0, 80)); await sleep(2000); await shot('v18-mass-pipeline');
out.dialog = (await txt()).split('\n').map(l => l.trim()).filter(l => /New pipeline|Stage in the new|Standard|^1$|Update records|first stage/i.test(l)).slice(0, 14);
return done({ ...out, reqs });
