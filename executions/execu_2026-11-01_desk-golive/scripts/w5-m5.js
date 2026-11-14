const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 1200) : t.slice(-1200); };
for (let i = 0; i < 30; i++) { const t = await wz(); if (!/Queued|Running|being imported/.test(t)) break; await sleep(4000); }
out.result = await wz(); await shot('w5/W5-35-result');
const f = [{ field: 'last_name', operator: 'contains', value: 'Imp' }, { field: 'first_name', operator: 'equals', value: 'QA GL W5' }];
const r = await api('GET', '/modules/' + CM + '/records?page=1&per_page=10&filters=' + encodeURIComponent(JSON.stringify(f)));
out.found = arr(D(r.j)).map(x => { const o = { id: x.id }; for (const d of x.data) if (/name|email/.test(d.field)) o[d.field] = d.value && d.value.value; return o; });
return fin({ out });
