const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const ID = '79dfedf8-0634-40a5-a8df-7a8ac9f25014'; const R = { hits: [], calls: [] };
page.on('response', async r => { const u = r.url(); if (!u.includes('/api/v1/') || u.includes('/iam/auth')) return; R.calls.push(r.status() + ' ' + u.replace(/^https:\/\/[^/]+/, '').slice(0, 140)); try { const t = await r.text(); const m = t.match(/.{0,100}(2026-05-01|RT18 date|qa_rt18_date).{0,100}/); if (m) R.hits.push(u.replace(/^https:\/\/[^/]+/, '').slice(0, 140) + ' :: ' + m[0]); } catch (e) {} });
await page.goto(H + '/modules/' + MID + '/records/' + ID, { waitUntil: 'domcontentloaded' }); await sleep(9000);
const t = (await text()).replace(/\s+/g, ' ');
R.pageDate = (t.match(/.{0,120}(2026-05-01|May 1, 2026|01\/05\/2026|05\/01\/2026|RT18 date).{0,80}/g) || []).slice(0, 5);
await shot('2985-1-u1-record.png', { fullPage: true });
for (const lab of ['Timeline', 'Activity', 'History', 'Recent activity']) { const tab = page.getByRole('tab', { name: new RegExp(lab, 'i') }); if (await tab.count()) { await tab.first().click(); await sleep(4000); R.tab = lab; break; } }
const t2 = (await text()).replace(/\s+/g, ' ');
R.afterTab = (t2.match(/.{0,120}(2026-05-01|May 1, 2026|01\/05\/2026|05\/01\/2026|RT18 date).{0,80}/g) || []).slice(0, 5);
R.activityText = (t2.match(/(Recent activity|Timeline).{0,600}/i) || [''])[0];
await shot('2985-2-u1-timeline.png', { fullPage: true });
R.calls = R.calls.filter(c => !/notifications|presence/.test(c)).slice(0, 40);
return R;
