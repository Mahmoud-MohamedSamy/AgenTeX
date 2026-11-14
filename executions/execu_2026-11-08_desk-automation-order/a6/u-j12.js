const net = []; page.on('response', async r => { if (/drafts|blueprint-transitions/.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + r.url().split('/api/v1')[1].slice(0, 80) + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
const open = async () => { await page.locator('[data-testid=desk-ticket-blueprint-buttons]').getByRole('button', { name: /QA verify/ }).click(); await sleep(2500); };
await go('/views/all/tickets/e21c1bda-2a5e-470e-8bbf-26b407cb6c4e'); await sleep(7000);
await open();
await page.locator('textarea').last().fill('QA J12 typed description');
await page.locator('[contenteditable=true]').last().click(); await page.keyboard.type('QA J12 internal note'); await sleep(500);
// J12: Cancel with text
await page.getByRole('button', { name: 'Cancel' }).last().click(); await sleep(1500);
const dl = page.getByRole('dialog').last(); log('J12 prompt', (await dl.innerText().catch(() => 'NO DIALOG')).replace(/\s+/g, ' ').slice(0, 400)); await shot('j12-leave-prompt');
log('prompt buttons', await dl.getByRole('button').allInnerTexts().catch(() => []));
// stay, then save draft
const stay = dl.getByRole('button', { name: /stay|keep|back|cancel/i }).first(); if (await stay.count()) { await stay.click(); await sleep(1000); }
const sd = page.getByRole('button', { name: 'Save draft' }).last(); log('save draft visible', await sd.isVisible().catch(() => false));
if (await sd.isVisible().catch(() => false)) { await sd.click(); await sleep(3000); }
log('toast', (await page.locator('[data-sonner-toast],[role=status]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 200));
await shot('z8-after-save');
await page.reload(); await sleep(9000);
log('draft chip', await page.locator('[data-testid*=draft]').evaluateAll(a => a.map(x => x.getAttribute('data-testid') + ':' + x.innerText.replace(/\s+/g, ' ').slice(0, 60))));
await shot('z8-after-reload');
await open();
log('reopened', await page.locator('textarea').last().inputValue().catch(() => '?'), (await page.locator('[contenteditable=true]').last().innerText().catch(() => '?')).slice(0, 60));
await shot('z8-reopened');
log('net', net);
