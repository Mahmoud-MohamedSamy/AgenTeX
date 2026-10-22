const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const resp = []; const f = async r => { const u = r.url(); if (/iam\/(users|profiles|org-units)/.test(u)) resp.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(900);
const menu = await page.locator('[role=menu]').allInnerTexts();
await page.getByText(/Layout Permission/).first().click(); await sleep(2000);
const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(1500);
if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(1500); }
const pick = (await txt()).match(/Select principals for[\s\S]{0,900}/)?.[0];
await shot('2229-03-picker-users');
// switch kind to Profiles
const kinds = page.getByRole('tab').or(page.getByRole('button', { name: /^Profiles$/ }));
const pb = page.getByRole('button', { name: 'Profiles', exact: true }).or(page.getByRole('tab', { name: 'Profiles' })).first();
let prof = null; if (await pb.count()) { await pb.click(); await sleep(2000); prof = (await txt()).match(/Select principals for[\s\S]{0,700}/)?.[0]; await shot('2229-04-picker-profiles'); }
page.off('response', f);
return done({ menu, pick, prof, resp });
