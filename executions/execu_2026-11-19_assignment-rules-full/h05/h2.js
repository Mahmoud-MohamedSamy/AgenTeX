await page.goto(H + '/settings/customization/skills', { waitUntil: 'commit' }); await sleep(9000);
const openL = async lab => { await page.locator('button[aria-label="' + lab + '"]').first().click(); await sleep(1200); return page.evaluate(() => [...document.querySelectorAll('[role=option]')].filter(e => e.getBoundingClientRect().height > 0).map(e => e.innerText.trim().slice(0, 50))); };
log('dept', await openL('Department')); await shot('H05-2-dept-menu.png');
await page.getByRole('option', { name: 'QA AS6 Dept A' }).click(); await sleep(4000);
for (const l of ['Skill type', 'Agent', 'Status']) { const b = await page.locator('button[aria-label="' + l + '"]').count(); log(l, b, b ? await openL(l) : 'no aria'); await page.keyboard.press('Escape'); await sleep(500); }
log('rows', await page.evaluate(() => [...document.querySelectorAll('button[aria-label^="Actions for "]')].map(b => b.getAttribute('aria-label').slice(12))));
log('txt', (await text()).replace(/\s+/g, ' ').split('Add Skill')[1]?.slice(0, 900));
log('url', page.url()); await shot('H05-3-deptA-all.png');
