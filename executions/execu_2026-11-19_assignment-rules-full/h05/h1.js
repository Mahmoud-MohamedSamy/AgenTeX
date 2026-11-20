await page.goto(H + '/settings/customization/skills', { waitUntil: 'commit' }); await sleep(10000);
log('url', page.url());
await shot('H05-1-skills-page.png');
const ctl = await page.evaluate(() => [...document.querySelectorAll('input, select, button, [role=combobox], [role=tab]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(e => e.tagName + '|' + (e.getAttribute('placeholder') || e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)));
log('controls', ctl);
log('text', (await text()).replace(/\s+/g, ' ').slice(0, 1500));
