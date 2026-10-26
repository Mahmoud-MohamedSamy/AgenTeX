// F3 Send as private: full request/response + toast
const tk = '60e81b1b-e8ae-4a5d-aad9-70b69d9624b9';
const net = []; const onR = async r => { const q = r.request(); if (q.method() === 'POST' && /replies/.test(r.url())) net.push({ body: (q.postData() || '').replace(/<!--desk-quote-->[\s\S]*$/, '…'), status: r.status(), resp: (await r.text().catch(() => '')).slice(0, 500) }); }; page.on('response', onR);
await go(`/modules/${M.tickets}/records/${tk}`, 9000); await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000);
const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL F3b send as private. '); await sleep(600);
await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1000); await page.getByRole('menuitem', { name: 'Send as private' }).click(); await sleep(6000);
const toast = await page.$$eval('[data-sonner-toast]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => '');
const s = await shot('RPL-F3-after');
page.off('response', onR);
return JSON.stringify({ net, toast, s });
