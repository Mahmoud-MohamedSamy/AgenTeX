const MID = 'c0394292-52a2-446d-a326-06733fe289ba';
const resp = []; const f = async r => { const u = r.url(); if (/iam\/(users|profiles|org-units)/.test(u)) resp.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
await go(`/settings/modules-and-fields/${MID}`, 10000);
const tabs = await page.getByRole('tab').allInnerTexts();
const ac = page.getByRole('tab', { name: /Access Control/ }); if (await ac.count()) { await ac.click(); await sleep(3000); }
const t1 = (await txt()).split('Access Control')[1]?.slice(0, 600);
await shot('2229-01-access-control');
page.off('response', f);
return done({ tabs, t1, resp });
