const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 1500) : t.slice(-1200); };
out.sel = await page.locator('select').evaluateAll(es => es.map(e => e.options[e.selectedIndex].text));
await page.getByRole('button', { name: /^Next$/ }).last().click(); await sleep(5000); out.assign = (await wz()).slice(0, 500);
await page.getByRole('button', { name: /^(Save & next|Next)$/ }).last().click(); await sleep(6000); out.review = (await wz()).slice(0, 1200); await shot('w5/W5-38-review');
if (/Rows that will import [1-9]/.test(out.review)) { await page.getByText(/I confirm I have permission to import/).click(); await sleep(600);
  const n0 = NET.length; await page.getByRole('button', { name: /^Submit$/ }).click();
  for (let i = 0; i < 30; i++) { await sleep(3000); const t = await wz(); if (/Import complete|Completed|failed/i.test(t) && !/Queued|being imported/.test(t)) break; }
  out.result = (await wz()).slice(0, 500); await shot('w5/W5-38-result');
  const m = NET.slice(n0).map(x => x.u).join(' ').match(/import\/([0-9a-f-]{36})\/execute/); if (m) CREATED.push({ kind: 'import', id: m[1], name: 'QA GL W5 tickets import', mod: '88e8ea44-1658-4df3-9930-d0902b91073d' }); }
const TM = '88e8ea44-1658-4df3-9930-d0902b91073d'; const f = [{ field: 'subject', operator: 'contains', value: 'QA GL W5 Imp T' }];
const r = await api('GET', '/modules/' + TM + '/records?page=1&per_page=10&filters=' + encodeURIComponent(JSON.stringify(f)));
out.found = arr(D(r.j)).map(x => { const o = { id: x.id }; for (const d of x.data) if (/subject|department|status|priority|ticket_number|contact|email/.test(d.field)) o[d.field] = d.value && d.value.value; return o; });
for (const t of out.found) { CREATED.push({ kind: 'ticket', id: t.id, name: t.subject }); const d = await api('GET', '/desk/tickets/' + t.id); t.desk = d.s + ' ' + ((D(d.j) || {}).department_id || '') + ' #' + ((D(d.j) || {}).ticket_number || ''); }
return fin({ out });
