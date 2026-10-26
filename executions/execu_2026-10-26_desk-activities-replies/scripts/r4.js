// Diagnose C3 (Cc) + E1 (Save draft) with screenshots and network capture
let out0 = {};
const tk = '4df60527-2c5c-4943-bae7-c4ce5967042c';
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/') && !/viewers|read$|summaries|heartbeat|presence|resolved|realtime|iam\//.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 300) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', onR);
const toastT = async () => (await page.$$eval('[data-sonner-toast]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => ''));
out0 = { mineBefore: (await api('GET', `/desk/tickets/${tk}/drafts/mine`)).t.slice(0, 400) };
await go(`/modules/${M.tickets}/records/${tk}`, 10000);
await page.locator('main button').filter({ hasText: /^Reply All/ }).first().click(); await sleep(4000);
await page.getByRole('button', { name: 'Cc', exact: true }).click(); await sleep(800);
const emails = await page.$$eval('main input[type=email]', es => es.map(e => (e.getAttribute('aria-label') || '') + '|' + (e.getAttribute('placeholder') || '')));
const ccIn = page.locator('main input[type=email]:not([aria-label="Recipients"]):not([aria-label="Add an email address"])').first();
await ccIn.click(); await ccIn.fill(QA_CC); await sleep(300); await page.keyboard.press('Enter'); await sleep(800);
const chips = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label')));
const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL C3b with cc. '); await sleep(800);
const s1 = await shot('RPL-C3-before-send');
net.length = 0; await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(6000);
const t1 = await toastT(); const s2 = await shot('RPL-C3-after-send');
const out = { ...out0, emails, chips, toast: t1, net: net.slice(0, 6), s1, s2 };
// E1 save draft
await page.locator('main button').filter({ hasText: /^Reply All/ }).first().click().catch(() => {}); await sleep(4000);
const ed2 = page.locator('[aria-label="Reply body"]'); await ed2.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL E1b draft text. '); await sleep(800);
net.length = 0; await page.getByRole('button', { name: 'Save draft' }).click(); await sleep(3500);
out.draftToast = await toastT(); out.draftNet = net.slice(0, 4); out.drafts = (await api('GET', `/desk/tickets/${tk}/drafts`)).t.slice(0, 300); out.mine = (await api('GET', `/desk/tickets/${tk}/drafts/mine`)).t.slice(0, 400); out.s3 = await shot('RPL-E1-after-save');
page.off('response', onR);
return JSON.stringify(out);
