await page.goto(H + '/activities', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Add Activity/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Add Activity' }).click(); await sleep(1500);
await page.getByRole('menuitem', { name: /Task/ }).first().click().catch(() => page.getByText('Task', { exact: true }).last().click());
const d = page.locator('[role=dialog]').last();
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Department/i.test(await d.innerText().catch(() => ''))) break; } await sleep(2000);
const sel = d.locator('select').first(); log('select count', await d.locator('select').count());
if (await d.locator('select').count()) { await sel.selectOption({ label: 'QA AS6 Dept B' }); }
else { await d.getByText('Sales', { exact: true }).first().click(); await sleep(1000); await page.getByText('QA AS6 Dept B', { exact: true }).last().click(); }
await sleep(2500); log('owner field now:', (await d.innerText()).match(/Task Owner\n[\s\S]{0,60}/)[0]);
await d.locator('text=Task Owner').locator('xpath=following::*[1]').click(); await sleep(2500);
let opts = await page.locator('[role=option]').allInnerTexts(); log('owner opts DeptB (' + opts.length + '):', opts.join(' ; '));
await shot('2635-owner-deptB.png');
await page.keyboard.press('Escape'); await sleep(500);
await sel.selectOption({ label: 'HR' }).catch(e => log('hr', e.message.slice(0, 80))); await sleep(2500);
log('owner field after HR:', (await d.innerText()).match(/Task Owner\n[\s\S]{0,60}/)[0]);
