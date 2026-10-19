const out = {};
await page.goto(H + '/workqueue/activities/tasks', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(15000);
out.deepReload = { badge: await badge(), total: await total() }; await shot('NDC-1789-deep-reload-lost');
await pick(/^Calls, /); await pick(/^Tasks, /); await sleep(3000); await panel();
out.afterSectionClick = { badge: await badge(), total: await total(), row: await rowTxt() }; await shot('NDC-1789-section-click-restored');
return done(out);
