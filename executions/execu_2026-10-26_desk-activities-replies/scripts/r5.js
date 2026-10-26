// Clean draft test on QA RPL ticket 2 (no local draft there): type, Save draft, watch network + localStorage; then reopen in a new page
const tk = (await (async () => { const L = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`); return ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl).find(x => x.subject === 'QA RPL ticket 2').id; })());
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/') && !/viewers|read$|summaries|heartbeat|presence|resolved|realtime|iam\//.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 200) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', onR);
const out = { tk };
await go(`/modules/${M.tickets}/records/${tk}`, 10000);
out.ls0 = await page.evaluate(() => Object.keys(localStorage).filter(k => /draft|reply|compose/i.test(k)));
await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000);
const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL E1c draft. '); await sleep(1000);
net.length = 0; await page.getByRole('button', { name: 'Save draft' }).click(); await sleep(6000);
out.netSave = net.slice(0, 5); out.mine = (await api('GET', `/desk/tickets/${tk}/drafts/mine`)).t.slice(0, 300);
out.ls1 = await page.evaluate(() => Object.keys(localStorage).filter(k => /draft|reply|compose/i.test(k)));
out.saveLabel = await page.$$eval('main *', es => es.filter(e => e.children.length === 0 && /Saved|draft/i.test(e.textContent || '')).map(e => e.textContent.trim()).slice(0, 5));
// wait for an autosave window
net.length = 0; await page.keyboard.type('more text '); await sleep(20000); out.netAuto = net.slice(0, 5);
out.s = await shot('RPL-E1c');
page.off('response', onR);
return JSON.stringify(out);
