const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
await page.goto(B + `/modules/${L}/records/${REC}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.body.innerText.includes('QA R2SC Perf lead'), null, { timeout: 90000 });
await sleep(3000);
out.tabs = await page.$$eval('[role=tab], main button', es => es.map(e => e.innerText.trim()).filter(t => t && t.length < 25)).then(a => [...new Set(a)]);
const tab = page.locator('[role=tab]:has-text("Files"), button:has-text("Files"), [role=tab]:has-text("Attachments")').first();
await tab.click({ timeout: 10000 }).catch(e => out.tabErr = String(e.message).slice(0, 100));
await sleep(4000);
out.filesText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 1500);
await page.screenshot({ path: RAW + 'att-files-tab.png', fullPage: false });
// upload by the file input: a .txt (client list allows it) and a .pdf
const input = page.locator('main input[type=file]').first();
out.inputs = await page.locator('main input[type=file]').count();
out.accept = await input.getAttribute('accept').catch(() => null);
const toasts = [];
const grab = async () => { const t = await page.$$eval('[role=status], [role=alert], [data-sonner-toast], .toast', es => es.map(e => e.innerText.trim()).filter(Boolean)); toasts.push(...t); };
await input.setInputFiles({ name: 'qa-r2sc-ui.txt', mimeType: 'text/plain', buffer: Buffer.from('QA R2SC ui text') });
for (let i = 0; i < 40; i++) { await sleep(1000); await grab(); if (toasts.length) break; }
out.txtToasts = [...new Set(toasts)]; toasts.length = 0;
await page.screenshot({ path: RAW + 'att-ui-txt.png' });
await sleep(3000);
await input.setInputFiles({ name: 'qa-r2sc-ui.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 QA R2SC ui pdf') });
for (let i = 0; i < 60; i++) { await sleep(1000); await grab(); if (toasts.length) break; }
out.pdfToasts = [...new Set(toasts)]; toasts.length = 0;
await sleep(3000);
out.filesText2 = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 1500);
await page.screenshot({ path: RAW + 'att-ui-after-upload.png' });
await input.setInputFiles({ name: 'qa-r2sc-ui.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') });
for (let i = 0; i < 20; i++) { await sleep(1000); await grab(); if (toasts.length) break; }
out.exeToasts = [...new Set(toasts)];
