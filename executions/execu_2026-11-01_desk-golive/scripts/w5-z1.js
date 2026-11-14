// W5-75 other-tenant id: an Anyware-Staging contact id from Wave 1 baseline is not available; use random + a known id from Anyware run files if present
out.rand = (await api('GET', '/modules/' + CM + '/records/' + '0bbb599e-0000-4000-8000-000000000001')).s;
out.other = (await api('GET', '/modules/0bbb599e-1b05-4a2d-a2e2-5d2bd5b8b0a1/records?limit=1')).s;
// W5-76 XSS contact
const r = await mk(CM, 'contact', 'QA GL W5 xss', { first_name: 'QA GL W5', last_name: '<img src=x onerror=alert(1)>', email: 'qa-gl-w5-xss@example.com' }); out.xss = r;
let alerted = false; const onA = d => { alerted = true; }; page.on('dialog', onA);
await go('/modules/' + CM, 10000); out.listShows = (await mtxt()).includes('<img src=x onerror=alert(1)>');
await go('/modules/' + CM + '/customers/' + r.id, 10000); out.pageShows = (await mtxt()).includes('<img src=x');
await page.getByRole('button', { name: /Search or jump/ }).first().click(); await sleep(800); await page.keyboard.type('onerror', { delay: 40 }); await sleep(3500); out.searchShows = (await page.locator('body').innerText()).includes('<img src=x'); await shot('w5/W5-76-search'); await page.keyboard.press('Escape');
out.imgs = await page.locator('img[src="x"]').count(); out.alerted = alerted; page.off('dialog', onA);
// W5-72 timings (3 loads each)
const tm = async u => { const r = []; for (let i = 0; i < 3; i++) { const t0 = Date.now(); await page.goto(H + u, { waitUntil: 'domcontentloaded' }); for (let k = 0; k < 60; k++) { await sleep(250); const t = await mtxt(); if (t.length > 300 && !/Loading/.test(t.slice(0, 300))) break; } r.push(((Date.now() - t0) / 1000).toFixed(1)); } return r.join('/'); };
out.t_contacts = await tm('/modules/' + CM); out.t_contact = await tm('/modules/' + CM + '/customers/' + C1); out.t_overview = await tm('/analytics/dashboards/standard/overview'); out.t_activities = await tm('/activities');
return fin({ out });
