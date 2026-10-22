await page.evaluate(() => window.scrollTo(0, 0));
const resp = []; const f = async r => { const u = r.url(); if (u.includes('/notifications') || u.includes('remind')) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 160) + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 1500)); }; page.on('response', f);
await page.mouse.click(963, 28); await sleep(3000);
page.off('response', f);
const pan = await page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').allInnerTexts();
await shot('1332-00-reminder-panel');
return done({ now: new Date().toISOString(), resp, pan: pan.map(x => x.slice(0, 800)) });
