await page.goto(H + '/activities', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Add Activity/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Add Activity' }).click(); await sleep(1500);
await page.getByRole('menuitem', { name: /Task/ }).first().click().catch(() => page.getByText('Task', { exact: true }).last().click());
const d = page.locator('[role=dialog]').last();
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Department/i.test(await d.innerText().catch(() => ''))) break; } await sleep(2000);
// owner list before
const ownerBtn = d.getByText('ndc-staging-owner').first(); await ownerBtn.click(); await sleep(2500);
const lb = async () => (await page.locator('[role=listbox], [role=option], [cmdk-list], [role=menu]').allInnerTexts().catch(() => [])).join(' | ');
let opts = await page.locator('[role=option]').allInnerTexts(); log('owner opts BEFORE (' + opts.length + '):', opts.slice(0, 200).join(' ; '));
await shot('2635-owner-before.png');
await page.keyboard.press('Escape'); await sleep(800);
// department
const dep = d.getByText('Sales', { exact: true }).first(); await dep.click(); await sleep(1500);
log('dept opts:', (await page.locator('[role=option]').allInnerTexts()).length);
await page.locator('[role=option]', { hasText: 'QA AS6 Dept B' }).first().click(); await sleep(2500);
log('after dept:', (await d.innerText()).slice(0, 400));
await d.getByText(/ndc-staging-owner|Select/).nth(0).click().catch(e => log('ownerclick', e.message.slice(0, 100))); await sleep(2500);
opts = await page.locator('[role=option]').allInnerTexts(); log('owner opts AFTER (' + opts.length + '):', opts.slice(0, 200).join(' ; '));
await shot('2635-owner-after.png');
