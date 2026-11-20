await page.goto(H + '/settings/customization/skills', { waitUntil: 'commit' }); await page.locator('button[aria-label="Department"]').first().waitFor({ timeout: 60000 }); await sleep(2000);
const pick = async (lab, opt) => { await page.locator('button[aria-label="' + lab + '"]').first().click(); await sleep(900); await page.getByRole('option', { name: opt, exact: true }).click(); await sleep(1800); };
const rows = async () => page.evaluate(() => [...document.querySelectorAll('button[aria-label^="Actions for "]')].map(b => b.getAttribute('aria-label').slice(12).replace(/QA AS6 <img[^>]*>/, 'xss').replace('QA AS6 ', '').replace('QA H05 ', '')));
await pick('Department', 'QA AS6 Dept A'); await sleep(1500); log('order before', (await rows()).join(', '));
const S = page.getByPlaceholder('Search skills'); await S.fill('billing'); await sleep(1500); log('filtered', (await rows()).join(', '));
const h = page.locator('button[aria-label^="Drag QA H05 Beta"]'); const b1 = await h.boundingBox(); const t = await page.locator('button[aria-label^="Drag QA H05 Alpha"]').boundingBox();
await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2); await page.mouse.down(); await sleep(200);
for (let i = 1; i <= 12; i++) { await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2 - (b1.y - t.y + 10) * i / 12); await sleep(40); }
await page.mouse.up(); await sleep(3500); log('filtered after drag', (await rows()).join(', ')); await shot('H05-9-drag-filtered.png');
log('toast', ((await text()).match(/(saved|updated|order[^.]{0,40}|error[^.]{0,60})/i) || [])[0]);
await S.fill(''); await sleep(1500); log('order after clear', (await rows()).join(', '));
await page.reload({ waitUntil: 'commit' }); await page.locator('button[aria-label="Department"]').first().waitFor({ timeout: 60000 }); await sleep(2000); await pick('Department', 'QA AS6 Dept A'); await sleep(1500); log('order after reload', (await rows()).join(', '));
await page.getByText('Agent Skills', { exact: true }).last().click(); await sleep(3500);
const A = page.getByPlaceholder('Search agents'); const ar = async () => (await text()).replace(/\s+/g, ' ').split('Search agents')[1]?.slice(0, 400);
log('agents all', await ar()); await A.fill('test'); await sleep(1500); log('agents "test"', await ar()); await shot('H05-10-agent-skills-search.png');
await A.fill('DEV'); await sleep(1500); log('agents "DEV"', await ar()); await A.fill('zzqq'); await sleep(1500); log('agents none', await ar());
