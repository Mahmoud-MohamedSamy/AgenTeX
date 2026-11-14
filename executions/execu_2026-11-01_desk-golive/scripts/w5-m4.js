const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 1500) : t.slice(-1200); };
await page.getByText(/I confirm I have permission to import/).click(); await sleep(800);
const n0 = NET.length; await page.getByRole('button', { name: /^Submit$/ }).click();
for (let i = 0; i < 25; i++) { await sleep(3000); const t = await wz(); if (/(imported|completed|finished|failed)/i.test(t) && !/Review and submit/.test(t)) break; }
out.result = await wz(); await shot('w5/W5-35-result');
out.net = NET.slice(n0).filter(x => /import/i.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'import', id: m[1], name: 'QA GL W5 contacts import' }); out.jid = m[1]; }
return fin({ out });
