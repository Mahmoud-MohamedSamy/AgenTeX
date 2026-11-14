const net = []; page.on('response', async r => { if (/blueprints\/(dashboard|states|stats|reports)/.test(r.url())) net.push(r.status() + ' ' + r.url().split('/api/v1')[1].slice(0, 120)); });
for (const p of ['/analytics/dashboards/blueprints', '/dashboards/blueprints']) { await go(p); await sleep(9000); if (!/\/hq$/.test(page.url())) break; }
log('url', page.url().replace(H, ''));
log('dash', (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 2500)); await shot('z14-dashboard');
log('net', net);
await page.mouse.wheel(0, 900); await sleep(1500); await shot('z14-dashboard-2');
await go('/analytics'); await sleep(6000); log('analytics links', ((await text()).match(/[^\n]{0,30}(Blueprint|blueprint)[^\n]{0,60}/g) || []).slice(0, 6));
