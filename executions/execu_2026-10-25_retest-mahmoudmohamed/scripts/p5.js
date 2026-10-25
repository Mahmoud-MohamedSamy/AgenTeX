const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const pat = page.getByLabel('Criteria pattern'); const out = {};
await pat.fill(''); await pat.click(); await page.keyboard.type('(1 OR 2)', { delay: 60 }); await sleep(500); out.typedOr = await pat.inputValue();
await shot('2122-02-typed-upper');
await pat.fill(''); await pat.click(); await page.keyboard.type('(1 AND 2)', { delay: 60 }); await sleep(500); out.typedAnd = await pat.inputValue();
await page.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(1000);
out.after = ((await txt()).split('Criteria Pattern')[1] || '').split('\n').slice(0, 3).join(' | ');
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views$/.test(q.url().split('?')[0])) resp.push({ s: r.status(), req: q.postData()?.match(/"pattern":"[^"]*"/)?.[0], id: (await r.json().catch(() => ({})))?.data?.id }); }; page.on('response', f);
await page.getByRole('button', { name: /^Save$/ }).last().click();
for (let k = 0; k < 30 && !resp.length; k++) await sleep(1000);
page.off('response', f); out.save = resp;
if (resp[0]?.id) { const g = await api('GET', `/modules/${L}/views/${resp[0].id}`); out.stored = g.j.data.settings?.criteria?.pattern; }
const body = p => ({ kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA' }, { field: 'company', operator: 'contains', value: 'QA' }], pattern: p } } });
for (const [k, p] of [['apiUpper', '(1 AND 2) OR 1'], ['apiMixed', '1 And 2']]) { const r = await api('POST', `/modules/${L}/views`, { name: 'QA RT 2122 ' + k, ...body(p) }); out[k] = r.s + ' ' + (r.j?.data?.id ? r.j.data.id + ' stored=' + r.j.data.settings?.criteria?.pattern : r.t.slice(0, 250)); }
await sleep(2500); await shot('2122-03-saved');
return done(out);
