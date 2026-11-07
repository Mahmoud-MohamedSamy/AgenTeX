const out = []; page.on('response', async r => { const u = r.url(); if (/\/api\/v1\/desk\/tickets\/1072b3a0-a98c-4500-85a9-e144e44b433e\//.test(u)) out.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*api\/v1/, '') + ' ' + (await r.text().catch(() => '')).slice(0, 1500)); });
await page.goto(H + '/views/all/tickets/1072b3a0-a98c-4500-85a9-e144e44b433e', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2275 SKP 1/.test(await text())) break; } await sleep(4000);
await shot('2275-d0-ticket.png');
const tabs = await page.getByRole('tab').allInnerTexts(); log('tabs', tabs.join(' / '));
const h = page.getByRole('tab', { name: /History/i }); if (await h.count()) await h.first().click(); else await page.getByText(/^History$/).first().click().catch(e => log('no history tab'));
await sleep(8000); await shot('2275-d1-history-skp1.png');
const t = await text(); const i = t.lastIndexOf('History'); return { hist: t.slice(i, i + 2000), calls: out };
