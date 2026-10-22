const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.locator('[role=listbox] [role=option]').filter({ hasText: 'no_budget' }).first().click(); await sleep(600);
const d = page.locator('[role=dialog]').last();
await d.locator('input[type=date]').fill('2026-10-31'); await sleep(300);
await shot('1311-05-filled');
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + (q.postData()||'').slice(0, 500) + ' → ' + r.status()); }; page.on('response', f);
await d.getByRole('button', { name: 'Save and close' }).click(); await sleep(4000);
page.off('response', f);
const id = page.url().split('/records/')[1];
const rec = Object.fromEntries((await api('GET', `/modules/${D}/records/${id}`)).j.data.data.filter(x => /stage|reason|closing|amount/.test(x.field)).map(x => [x.field, x.value.value]));
// API free text check
const bad = await api('PATCH', `/modules/${D}/records/${id}`, { data: [{ field: 'reason_for_loss', value: { kind: 'string', value: 'test' } }] });
await shot('1311-06-saved');
return done({ resp, rec, freeText: bad.s + ' ' + (bad.j?.error?.details?.[0]?.message || bad.j?.error?.code || '') });
