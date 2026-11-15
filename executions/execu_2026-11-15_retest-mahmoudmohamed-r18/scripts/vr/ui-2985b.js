const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const ID = '79dfedf8-0634-40a5-a8df-7a8ac9f25014'; const W = process.env.W || 'u1'; const R = { hits: [], tl: [] };
page.on('response', async r => { const u = r.url(); if (!u.includes('/api/v1/') || u.includes('/iam/auth')) return; const s = u.replace(/^https:\/\/[^/]+/, ''); if (/timeline|history|audit|activit/i.test(s)) R.tl.push(r.status() + ' ' + s.slice(0, 160)); try { const t = await r.text(); const m = t.match(/.{0,100}(2026-05-01|RT18 date).{0,100}/); if (m && !/\/fields|layout-rules/.test(s)) R.hits.push(s.slice(0, 140) + ' :: ' + m[0]); } catch (e) {} });
await page.goto(H + '/modules/' + MID + '/records/' + ID, { waitUntil: 'domcontentloaded' }); await sleep(9000);
const grab = async () => ((await text()).replace(/\s+/g, ' ').match(/.{0,140}(2026-05-01|05\/2026|RT18 date).{0,100}/g) || []).slice(0, 5);
const tl = page.getByRole('tab', { name: /^Timeline$/i }).first(); await tl.click(); await sleep(5000); R.timeline = await grab();
R.timelineText = ((await text()).replace(/\s+/g, ' ').match(/Show Upcoming Automated Actions.{0,500}/) || [''])[0];
await shot(W === 'u1' ? '2985-3-u1-timeline.png' : '2985-4-owner-timeline.png');
const hi = page.getByRole('tab', { name: /^History$/i }); if (await hi.count()) { await hi.last().click(); await sleep(5000); R.history = await grab(); R.historyText = ((await text()).replace(/\s+/g, ' ').match(/History.{0,600}$/) || [''])[0].slice(0, 600); await shot(W === 'u1' ? '2985-5-u1-history.png' : '2985-6-owner-history.png'); }
return R;
