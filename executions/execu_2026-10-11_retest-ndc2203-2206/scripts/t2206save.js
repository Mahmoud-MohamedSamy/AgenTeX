const off = capOn(); const off2 = respOn(); const out = {};
await shot('NDC-2206-before-save');
await page.getByRole('button', { name: 'Save & Activate' }).click(); await sleep(6000);
out.url = page.url();
out.toasts = await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts();
await shot('NDC-2206-after-save');
out.req = cap.filter(c => /workflow/.test(c)); out.resp = capResp;
off(); off2(); return done(out);
