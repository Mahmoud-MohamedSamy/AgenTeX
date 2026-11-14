const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 1500) : t.slice(-1200); };
out.at = (await wz()).slice(0, 120);
await page.getByRole('button', { name: /^Save & next$/ }).click(); await sleep(6000);
out.review = await wz(); await shot('w5/W5-35-review');
const btns = await page.getByRole('button').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(x => /import|run|start|finish/i.test(x))); out.btns = btns;
const n0 = NET.length; await page.getByRole('button', { name: /^(Import|Run import|Start import|Import now)$/ }).last().click().catch(e => out.rErr = e.message.slice(0, 60));
for (let i = 0; i < 20; i++) { await sleep(3000); const t = await wz(); if (/imported|failed|error|complete|finished/i.test(t) && !/Importing/.test(t)) break; }
out.result = await wz(); await shot('w5/W5-35-result');
out.net = NET.slice(n0).filter(x => /import/i.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
const m = out.net.join(' ').match(/"(job_id|import_id|id)":"([0-9a-f-]{36})"/); if (m) CREATED.push({ kind: 'import', id: m[2], name: 'QA GL W5 contacts import' });
return fin({ out });
