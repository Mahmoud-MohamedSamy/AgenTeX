const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const resp = []; const f = async r => { const u = r.url(); if (/iam\/(users|profiles|org-units)/.test(u)) resp.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
const gear = page.locator('button[title*="etting" i], button[aria-label*="etting" i]').first(); const gc = await gear.count();
if (gc) await gear.click(); else await page.locator('header button:has(svg.lucide-settings)').first().click(); await sleep(1200);
const menu = await page.locator('[role=menu]').allInnerTexts();
await shot('2229-02-gear-menu');
page.off('response', f);
return done({ gc, menu, resp });
