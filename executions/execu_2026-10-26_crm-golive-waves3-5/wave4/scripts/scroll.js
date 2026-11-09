await page.goto('https://staging-crm.taviportal.com/settings/activity-reminders', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await page.waitForTimeout(1000); if ((await page.innerText('body')).includes('Reminder card fields')) break; }
await page.waitForTimeout(2000);
return await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 4 && e.clientHeight > 150; }).map(e => { const r = e.getBoundingClientRect(); return e.tagName + ' x=' + Math.round(r.x) + ' w=' + Math.round(r.width) + ' h=' + e.clientHeight + ' scrollH=' + e.scrollHeight + ' cls=' + String(e.className).slice(0, 50); }));
