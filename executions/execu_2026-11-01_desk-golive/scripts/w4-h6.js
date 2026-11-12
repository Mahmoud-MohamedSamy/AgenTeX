await sleep(3000);
const d = page.locator('[role=dialog],[role=alertdialog]'); out.dlgs = await d.count();
if (out.dlgs) { out.dlg = (await d.last().innerText()).replace(/\s+/g, ' ').slice(0, 400); await shot('w4/W4-79-import-dialog'); }
out.msg = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts()).join(' / ').slice(0, 300);
const li = page.locator('[data-testid=happiness-language-ar]'); out.arRow = (await li.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.save = await page.getByRole('button', { name: /^Save$/ }).last().isEnabled().catch(() => '?');
await shot('w4/W4-79-after-upload');
return fin({ out });
