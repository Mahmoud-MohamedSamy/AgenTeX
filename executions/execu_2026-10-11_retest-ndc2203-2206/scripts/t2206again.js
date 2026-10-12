const off2 = respOn(); const out = {};
await page.getByRole('button', { name: 'Save & Activate' }).click(); await sleep(5000);
out.toasts2 = await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts();
out.resp2 = capResp.slice();
await page.getByRole('button', { name: 'Back' }).click(); await sleep(2500);
out.leave = (await page.locator('[role=dialog],[role=alertdialog]').allInnerTexts()).join(' | ');
await shot('NDC-2206-leave-prompt');
const disc = page.getByRole('button', { name: /Discard/i }); if (await disc.count()) { await disc.first().click(); await sleep(5000); }
out.urlAfter = page.url();
const r = await api('GET', '/workflow/rules'); out.rulesNow = arr(r.j.data).map(x => x.name);
off2(); return done(out);
