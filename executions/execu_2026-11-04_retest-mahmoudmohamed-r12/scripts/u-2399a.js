const o = {}; const net = [];
page.on('response', async r => { const u = r.url(); if (/integrations\/crm\/(failures|runs|skipped)/.test(u)) net.push(r.status() + ' ' + decodeURIComponent(u.replace(/^.*api\/v1/, '')).slice(0, 140)); });
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/CRM ⇄ Desk Integration/.test(await text())) break; }
await page.getByText('CRM ⇄ Desk Integration', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Failure Log|Sync History/.test(await text())) break; } await sleep(2000);
o.tabs = ((await text()).match(/(Overview|Settings|Sync History|Failure Log|Mappings)[^\n]*/g) || []).slice(0, 10);
await page.getByText('Sync History', { exact: true }).first().click().catch(() => {}); await sleep(4000); await shot('2399-a-history.png'); o.history = ((await text()).match(/Sync History[\s\S]{0,900}/) || [''])[0].slice(0, 900);
await page.getByText('Failure Log', { exact: true }).first().click().catch(() => {}); await sleep(4000); await shot('2399-b-failures.png');
const t = await text(); o.failures = (t.match(/Failure Log[\s\S]{0,1200}/g) || ['']).pop().slice(0, 1200);
const sk = page.getByText(/^Skipped/).first(); if (await sk.count()) { await sk.click(); await sleep(4000); await shot('2399-c-skipped.png'); o.skipped = ((await text()).match(/Skipped[\s\S]{0,900}/g) || ['']).pop().slice(0, 900); }
o.net = net.slice(0, 10); return o;
