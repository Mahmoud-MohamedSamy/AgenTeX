const stop = capOn();
let open = await page.locator('[role=menu],[role=listbox]').count();
if (!open) { await page.getByText('Standard (Default)').first().click(); await sleep(1500); }
const m = page.locator('[role=menu],[role=listbox]').first();
const html = (await m.innerHTML()).slice(0, 1200);
await m.locator('[role=menuitem],[role=option],[role=menuitemradio],button').filter({ hasText: /^\s*1\s*$/ }).first().click(); await sleep(3000);
const dlg1 = await page.locator('[role=dialog]').allInnerTexts();
await shot('1302-03-change-pipeline-modal');
stop();
return done({ html, dlg1, cap: cap.filter(c => /^(POST|PATCH|PUT)/.test(c)) });
