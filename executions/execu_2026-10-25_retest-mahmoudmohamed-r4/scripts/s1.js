// NDC-1333: measure scroll layers on Settings › Activity Reminders; wheel past the column end; click a checkbox and check scroll.
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(H + '/settings/activity-reminders', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Reminder|Additional/.test(await txt().catch(() => ''))) break; } await sleep(2500);
const layers = () => page.evaluate(() => { const out = [{ el: 'window', sh: document.documentElement.scrollHeight, ch: innerHeight, top: scrollY }]; for (const e of document.querySelectorAll('*')) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.clientHeight > 100) out.push({ el: e.tagName + '.' + (e.className?.toString() || '').slice(0, 40), sh: e.scrollHeight, ch: e.clientHeight, top: e.scrollTop }); } return out; });
const out = { before: await layers() };
await shot('1333-01-top');
await page.mouse.move(800, 400); for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 400); await sleep(60); } await sleep(800);
out.afterWheel = await layers(); await shot('1333-02-after-wheel');
await page.mouse.move(800, 400); for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, -400); await sleep(60); } await sleep(500);
out.backTop = await layers();
return done(out);
