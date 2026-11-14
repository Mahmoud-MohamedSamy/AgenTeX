await go('/settings/automation/blueprints/new'); await sleep(8000);
const canvas = page.locator('.react-flow').first(); const D = page.locator('[draggable=true]');
await D.nth(0).dragTo(canvas, { targetPosition: { x: 200, y: 250 } }); await sleep(1200);
await D.nth(2).dragTo(canvas, { targetPosition: { x: 600, y: 250 } }); await sleep(1200);
await page.getByRole('button', { name: 'Save and Publish' }).click({ force: true }); await sleep(1500);
await page.locator('li').filter({ hasText: /needs a name/ }).last().locator('button').first().click(); await sleep(1500);
const addItem = page.locator('select').filter({ has: page.locator('option', { hasText: 'Add item' }) }).first();
await addItem.selectOption('field'); await sleep(1200);
const fsel = page.locator('select').filter({ has: page.locator('option', { hasText: 'Choose a field' }) }).first();
await fsel.selectOption({ label: 'Subject' }); await sleep(1500);
const col = page.getByText('What the agent fills in').locator('xpath=ancestor::div[2]');
log('during col', (await col.innerText()).replace(/\s+/g, ' ').slice(0, 800));
log('controls', await col.locator('input,select,button,textarea,[role=switch],[role=checkbox]').evaluateAll(a => a.map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.innerText || x.placeholder || x.type || '').replace(/\s+/g, ' ').slice(0, 50))));
await shot('e14-subject-item');
// open any settings / more on the item
const more = col.getByRole('button', { name: /more|options|settings|edit/i }); log('more', await more.count());
if (await more.count()) { await more.first().click(); await sleep(1000); log('menu', (await page.locator('[role=menu],[role=dialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500)); await shot('e14-item-menu'); }
