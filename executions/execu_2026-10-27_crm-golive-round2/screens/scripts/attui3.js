const input = page.locator('main input[type=file]').nth(1);
await sleep(8000);
const toasts = []; const grab = async () => toasts.push(...await page.$$eval('[data-sonner-toast], [role=status], [role=alert]', es => es.map(e => e.innerText.trim()).filter(Boolean)));
await input.setInputFiles({ name: 'qa-r2sc-ui2.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') });
for (let i = 0; i < 15; i++) { await sleep(700); await grab(); }
out.exe = [...new Set(toasts)];
await page.screenshot({ path: RAW + 'att-ui-exe2.png' });
// svg preview: eye button on the script svg row
const title0 = await page.title();
const row = page.locator('li:has-text("qa-r2sc-script.svg")').first();
await row.locator('button[title="Preview"], button[aria-label="Preview"]').first().click().catch(e => out.prevErr = String(e.message).slice(0, 120));
await sleep(4000);
out.titleAfterPreview = await page.title(); out.titleBefore = title0;
out.previewHtml = await page.$$eval('[role=dialog] img, [role=dialog] iframe, [role=dialog] object, [role=dialog] embed', es => es.map(e => e.tagName + ' ' + (e.getAttribute('src') || e.getAttribute('data') || '').slice(0, 60)));
await page.screenshot({ path: RAW + 'att-ui-svg-preview.png' });
await page.keyboard.press('Escape'); await sleep(1000);
// download pdf through the UI
const prow = page.locator('li:has-text("qa-r2sc-ui.pdf")').first();
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(e => null), prow.locator('button[title="Download"], button[aria-label="Download"]').first().click()]);
out.download = dl ? { name: dl.suggestedFilename(), size: require('fs').statSync(await dl.path()).size } : 'no download event';
// delete the UI pdf through the UI
await prow.locator('button[title="Delete"], button[aria-label="Delete"]').first().click(); await sleep(1500);
out.confirmDialog = (await page.$$eval('[role=dialog], [role=alertdialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 200))));
await page.screenshot({ path: RAW + 'att-ui-delete-confirm.png' });
const btn = page.locator('[role=dialog] button:has-text("Delete"), [role=alertdialog] button:has-text("Delete")').last();
await btn.click().catch(e => out.delErr = String(e.message).slice(0, 100)); await sleep(4000);
toasts.length = 0; await grab(); out.deleteToasts = [...new Set(toasts)];
out.stillListed = (await page.innerText('main')).includes('qa-r2sc-ui.pdf');
