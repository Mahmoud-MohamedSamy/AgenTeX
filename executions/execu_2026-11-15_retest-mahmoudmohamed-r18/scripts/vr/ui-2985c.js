const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const ID = '79dfedf8-0634-40a5-a8df-7a8ac9f25014'; const W = process.env.W || 'u1'; const R = {};
await page.goto(H + '/modules/' + MID + '/records/' + ID, { waitUntil: 'domcontentloaded' }); await sleep(9000);
const t = (await text()).replace(/\s+/g, ' '); R.ra = (t.match(/Recent activit.{0,400}/i) || ['no Recent activity text'])[0]; R.date = (t.match(/.{0,100}(2026-05-01|RT18 date).{0,80}/g) || []);
const el = page.getByText(/Recent activit/i).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await sleep(1500); }
await shot(W === 'u1' ? '2985-5-u1-recent-activity.png' : '2985-6-owner-recent-activity.png');
return R;
