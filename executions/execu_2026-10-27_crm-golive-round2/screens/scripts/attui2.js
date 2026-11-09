const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
if (!page.url().includes(REC)) { await page.goto(B + `/modules/${L}/records/${REC}`, { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => document.body.innerText.includes('QA R2SC Perf lead'), null, { timeout: 90000 }); await sleep(2000); await page.locator('[role=tab]:has-text("Files"), button:has-text("Files")').first().click(); await sleep(4000); }
const ins = page.locator('main input[type=file]'); out.n = await ins.count();
out.accepts = []; for (let i = 0; i < out.n; i++) out.accepts.push(await ins.nth(i).getAttribute('accept'));
const idx = out.accepts.findIndex(a => !a || !a.startsWith('image/png')); const input = ins.nth(idx < 0 ? 1 : idx);
const toasts = []; const grab = async () => toasts.push(...await page.$$eval('[role=status], [role=alert], [data-sonner-toast], li[data-sonner-toast]', es => es.map(e => e.innerText.trim()).filter(Boolean)));
for (const [name, mime, body] of [['qa-r2sc-ui.txt', 'text/plain', 'QA R2SC ui text'], ['qa-r2sc-ui.pdf', 'application/pdf', '%PDF-1.4 QA R2SC ui pdf'], ['qa-r2sc-ui.zip', 'application/zip', 'PK QA'], ['qa-r2sc-ui.exe', 'application/x-msdownload', 'MZ']]) {
  toasts.length = 0; const t0 = Date.now();
  await input.setInputFiles({ name, mimeType: mime, buffer: Buffer.from(body) });
  for (let i = 0; i < 90; i++) { await sleep(1000); await grab(); if (toasts.length) break; }
  out[name] = { toasts: [...new Set(toasts)], sec: Math.round((Date.now() - t0) / 1000) };
  await page.screenshot({ path: RAW + 'att-ui-' + name.replace(/\W/g, '_') + '.png' });
  await sleep(4000);
}
out.list = (await page.innerText('main')).replace(/\s+/g, ' ').match(/ATTACHMENTS.{0,400}/)?.[0];
