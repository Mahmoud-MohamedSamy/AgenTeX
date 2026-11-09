const G2 = '7326ffa9-27c8-41f7-b8dc-35fb64c40e07'; const o = { errs: [] };
page.on('response', async r => { if (r.status() >= 400 && /api\/v1/.test(r.url()) && !/iam\/auth/.test(r.url())) o.errs.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^.*api\/v1/, '').slice(0, 120) + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
await page.goto(H + '/views/all/tickets/' + G2, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/not available|could not be loaded|g2 admin-owned/i.test(await text())) break; } await sleep(4000);
await shot('2754-a7-agent-reload.png'); o.msg = ((await text()).replace(/\s+/g, ' ').match(/.{0,80}(not available|could not be loaded).{0,160}/i) || [''])[0];
return o;
