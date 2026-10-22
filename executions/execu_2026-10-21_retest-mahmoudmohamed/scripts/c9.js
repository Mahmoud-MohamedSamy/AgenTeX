const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.locator('[role=listbox] [role=option]').filter({ hasText: /^Pipeline$/ }).click(); await sleep(1500);
const dlg = await page.locator('[role=dialog]').innerText();
const btns = page.locator('[role=dialog] button[aria-haspopup=listbox]');
const n = await btns.count(); const lists = [];
for (let i = 1; i < n; i++) { await btns.nth(i).click(); await sleep(1000); lists.push({ i, label: await btns.nth(i).innerText(), opts: await page.locator('[role=listbox] [role=option]').allInnerTexts() }); await page.keyboard.press('Escape'); await sleep(400); }
await shot('1316-05-pipeline-chosen');
return done({ dlg, n, lists });
