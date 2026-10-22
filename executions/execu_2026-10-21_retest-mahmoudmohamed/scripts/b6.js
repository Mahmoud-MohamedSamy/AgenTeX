const stop = capOn();
await page.getByText('Standard (Default)').first().click(); await sleep(2500);
const t = (await txt()).slice(-1500);
await shot('1302-02-change-pipeline-click');
stop();
return done({ t, dialogs: await page.locator('[role=dialog],[role=menu],[role=listbox]').allInnerTexts(), cap: cap.filter(c => /^(POST|PATCH|PUT)/.test(c)) });
