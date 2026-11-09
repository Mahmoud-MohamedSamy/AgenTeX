const out = {}; const reqs = [];
page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST', 'PUT'].includes(q.method()) && /records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 160); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 90) + ' ' + (q.postData() || '').slice(0, 300) + ' => ' + b); } });
const stageSel = page.getByText('Needs Analysis', { exact: true }).last(); await stageSel.click(); await sleep(1500);
out.stageOptions = (await page.locator('[role=option]').allInnerTexts()).map(s => s.trim()).slice(0, 15); await shot('v17-stage-options');
const t1 = page.locator('[role=option]').filter({ hasText: /^test-01$|^Test 01$|test-01/i }).first(); if (await t1.count()) { await t1.click(); out.picked = 'test-01'; } else { await page.keyboard.press('Escape'); out.picked = 'kept Needs Analysis'; } await sleep(1000);
await shot('v17-before-confirm'); await page.getByRole('button', { name: 'Change pipeline', exact: true }).click(); await sleep(7000); await shot('v17-after-confirm');
out.toast = (await txt()).split('\n').filter(l => /updated|moved|error|Invalid|Failed/i.test(l)).slice(0, 4);
const g = await api('GET', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/a60da2df-a13c-4859-8322-eb3339d771c4'); const o = {}; for (const d of g.j?.data?.data || []) o[d.field] = d.value && d.value.value !== undefined ? d.value.value : d.value; out.stored = { pipeline: o.pipeline, stage: o.stage };
return done({ ...out, reqs });
