await go('/settings/automation/blueprints/new'); await sleep(8000);
const canvas = page.locator('.react-flow').first(); const D = page.locator('[draggable=true]');
await D.nth(0).dragTo(canvas, { targetPosition: { x: 200, y: 250 } }); await sleep(1200);
await D.nth(2).dragTo(canvas, { targetPosition: { x: 600, y: 250 } }); await sleep(1200);
await page.getByRole('button', { name: 'Save and Publish' }).click({ force: true }); await sleep(1500);
await page.locator('li').filter({ hasText: /needs a name/ }).last().locator('button').first().click(); await sleep(1500);
const sels = await page.locator('select').evaluateAll(a => a.map(s => [...s.options].map(o => o.text)));
log('selects', sels);
// add a Field item in During, look for validation/error message options
const addItem = page.locator('select').filter({ has: page.locator('option', { hasText: 'Add item' }) }).first();
const opts = await addItem.evaluate(s => [...s.options].map(o => o.value + '=' + o.text)); log('addItem', opts);
const fieldOpt = opts.find(o => /field/i.test(o)); if (fieldOpt) { await addItem.selectOption(fieldOpt.split('=')[0]); await sleep(1500); }
const dur = (await page.locator('body').innerText()).split('What the agent fills in').pop().split('After')[0].replace(/\s+/g, ' '); log('during after field', dur.slice(0, 900));
await shot('e14-field-item');
const inputs = await page.locator('section, div').filter({ hasText: 'What the agent fills in' }).last().locator('input,select,button,label').evaluateAll(a => a.filter(x => x.offsetParent).map(x => x.tagName + ':' + (x.innerText || x.placeholder || x.getAttribute('aria-label') || [...(x.options||[])].map(o=>o.text).join('/')).replace(/\s+/g,' ').slice(0, 80)));
log('during controls', inputs.slice(0, 40));
