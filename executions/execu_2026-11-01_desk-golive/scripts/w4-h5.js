await go('/settings/organization/customer-happiness', 10000);
const dlP = page.waitForEvent('download', { timeout: 20000 });
await page.getByRole('button', { name: 'Download Arabic translation file' }).click(); const dl = await dlP;
const p = RUN + '/wave4/raw/W4-79-' + dl.suggestedFilename(); await dl.saveAs(p); out.file = dl.suggestedFilename();
const li = page.locator('[data-testid=happiness-language-ar]'); out.arBtns = await li.locator('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')));
const n0 = NET.length;
const fcP = page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null);
await li.locator('button').last().click(); const fc = await fcP;
if (fc) await fc.setFiles(p); else await page.locator('[data-testid=happiness-languages-file]').setInputFiles(p);
await sleep(5000);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w4/W4-79-import-dialog'); await d.getByRole('button', { name: /import|confirm|save|replace/i }).last().click().catch(e => out.e = e.message.slice(0, 60)); await sleep(5000); }
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved|realtime|summaries/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-3).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 200));
out.msg = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts()).join(' / ').slice(0, 200);
out.arRow = (await li.innerText()).replace(/\s+/g, ' ');
await li.scrollIntoViewIfNeeded(); await shot('w4/W4-79-imported');
const dl2P = page.waitForEvent('download', { timeout: 20000 }); await page.getByRole('button', { name: 'Download Arabic translation file' }).click(); const dl2 = await dl2P; const p2 = p.replace('.json', '.after.json'); await dl2.saveAs(p2);
return fin({ out });
