await go('/settings/automation/blueprints/567fe10d-08ed-40f4-9cb0-9e96bd5a2601'); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'Open' }).first().click(); await sleep(1500);
const panel = page.getByRole('group', { name: /order/i }).first(); log('order group', await panel.count());
const body = (await page.locator('body').innerText()).replace(/\s+/g, ' '); log('state panel', body.slice(body.indexOf('Fit to screen')).slice(0, 2500));
await shot('zs-state-open');
await page.mouse.wheel(0, 600); await sleep(600);
const sc = page.locator('aside, [data-testid*=state]').last(); 
for (const sel of ['[data-testid*=state-panel]', 'aside']) { const c = page.locator(sel).last(); if (await c.count()) { await c.evaluate(e => e.scrollTop = 99999).catch(()=>{}); } }
await shot('zs-state-open-2');
log('controls', await page.locator('select,input,[role=switch],button').evaluateAll(a => a.filter(x => x.offsetParent && x.getBoundingClientRect().y > 450).map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.innerText || x.placeholder || '').replace(/\s+/g,' ').slice(0, 50) + (x.options ? ' [' + [...x.options].map(o => o.text).slice(0, 8).join('/') + ']' : ''))));
