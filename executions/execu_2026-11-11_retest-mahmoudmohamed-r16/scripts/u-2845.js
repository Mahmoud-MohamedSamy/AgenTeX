const P = process.env.PFX, VAL = process.env.VAL, EXP = +process.env.EXP;
await page.goto(H + '/customers', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/modules/.test(page.url()) && await page.getByRole('button', { name: /Search in this view/ }).count()) break; } await sleep(3000);
log(page.url());
const sb = page.getByRole('button', { name: /Search in this view/ }).first(); if (await sb.count()) await sb.click(); else log('no search btn');
await sleep(800); await page.keyboard.type(P); await page.keyboard.press('Enter'); await sleep(7000);
const rows = ((await text()).match(new RegExp(P + ' \d\d', 'g')) || []); log('rows seen', rows.length);
await shot('2845-' + EXP + '-list.png');
log(await page.$$eval('input[type=checkbox]', cs => cs.slice(0, 3).map(c => c.getAttribute('aria-label'))));
const all = page.locator('input[type=checkbox][aria-label="Select all"]').first(); await all.click({ force: true }); await sleep(2000);
if (EXP > 50) { for (let k = 0; k < 6; k++) { await page.mouse.move(900, 600); await page.mouse.wheel(0, 4000); await sleep(2500); } const cnt = async () => +(((await page.locator('button:has-text("×"), button').filter({ hasText: /^s*d+s*$/ }).first().innerText().catch(() => '0')) || '0').trim()); log('count after scroll', await cnt(), 'checked', await page.locator('input[type=checkbox]:checked').count()); if (await page.locator('input[type=checkbox]:checked').count() < EXP + 1) { await page.locator('input[type=checkbox][aria-label="Select all"]').first().click({ force: true }); await sleep(2000); } }
log('bar:', ((await text()).match(/\d+ (of \d+ )?selected[^\n]*/) || [''])[0], 'checked', await page.locator('input[type=checkbox]:checked').count());
await shot('2845-' + EXP + '-selected.png');
await page.getByRole('button', { name: 'Update', exact: true }).first().click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); log('update dialog:', (await d.innerText()).slice(0, 500));
await shot('2845-' + EXP + '-update-dialog.png');
await d.locator('button:has-text("Choose a field"), select').first().click({ force: true }); await sleep(1200);
const fo = page.locator('[role=option]', { hasText: /^Title$/ }).first(); if (await fo.count()) await fo.click(); else { log('opts', (await page.locator('[role=option]').allInnerTexts()).slice(0, 40)); throw new Error('no Title'); }
await sleep(1200); const inp = d.locator('input[type=text], input:not([type])').last(); await inp.fill(VAL); await sleep(500);
await shot('2845-' + EXP + '-update-filled.png');
await d.getByRole('button', { name: 'Update records' }).click(); for (let k = 0; k < 120; k++) { await sleep(2000); const tt = await text(); const m = tt.match(/(d+) of (d+) done/); if (k % 10 === 0) log('progress', m && m[0]); if (!m && k > 3) break; if (m && m[1] === m[2]) { await sleep(3000); break; } } await shot('2845-' + EXP + '-progress-end.png');
log('after update:', ((await text()).match(/\d+ records? updated[^\n]*/i) || ['(no toast text)'])[0]);
await shot('2845-' + EXP + '-updated.png');
