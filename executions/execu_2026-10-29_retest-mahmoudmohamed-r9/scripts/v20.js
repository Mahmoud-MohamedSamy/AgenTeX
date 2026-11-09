const out = {}; const reqs = [];
page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST', 'PUT'].includes(q.method()) && /mass|records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 90) + ' ' + (q.postData() || '').slice(0, 300) + ' => ' + b); } });
await page.getByText('Select pipeline…', { exact: true }).click(); await sleep(1200); out.pipes = (await page.locator('[role=option]').allInnerTexts()).slice(0, 6);
await page.locator('[role=option]').filter({ hasText: /^Standard/ }).first().click(); await sleep(1500);
out.stageDefault = (await txt()).split('\n').map(l => l.trim()).filter(l => /Stage in the new|Defaults|first stage|Qualification|Select stage/i.test(l)).slice(0, 6); await shot('v20-mass-filled');
await page.getByRole('button', { name: 'Update records', exact: true }).click(); await sleep(7000); await shot('v20-mass-after');
out.msg = (await txt()).split('\n').filter(l => /Updated|could not|updated|error|failed/i.test(l)).slice(0, 4);
const g = await api('GET', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/a60da2df-a13c-4859-8322-eb3339d771c4'); const o = {}; for (const d of g.j?.data?.data || []) o[d.field] = d.value && d.value.value !== undefined ? d.value.value : d.value; out.stored = { pipeline: o.pipeline, stage: o.stage };
return done({ ...out, reqs });
