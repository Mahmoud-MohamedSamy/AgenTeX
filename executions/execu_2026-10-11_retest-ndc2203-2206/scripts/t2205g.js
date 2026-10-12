const out = {}; const off2 = respOn();
await page.getByRole('textbox', { name: 'name@example.com' }).fill('qa.retest2205@qa.test');
const subj = page.getByRole('combobox', { name: 'Type or pick a subject' }); await subj.fill('QA retest NDC-2205'); await sleep(300); await page.keyboard.press('Escape'); await sleep(400);
await page.getByRole('textbox', { name: 'Description' }).fill('original description');
await shot('NDC-2205-ticket-form');
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(8000);
out.url = page.url(); out.toasts = await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts();
out.resp = capResp.filter(s => /records/.test(s)).map(s => s.slice(0, 300));
off2(); return done(out);
