// Screens for the 4 missing functions on 'QA BP ZM missing' (ids in zm-prep.json).
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/zm-prep.json'), 'utf8'));
await go('/settings/automation/blueprints/' + M.B); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'Open' }).first().click(); await sleep(2000);
const b = (await text()).replace(/\s+/g, ' '); const i = b.indexOf('Time limit'); log('state panel', b.slice(i, i + 900));
await shot('zm-state-panel');
// clock buttons and any business-hours set picker
log('clock controls', await page.locator('button,select').evaluateAll(a => a.filter(x => x.offsetParent && x.getBoundingClientRect().x > 1240).map(x => x.tagName + ':' + (x.innerText || '').replace(/\s+/g, ' ').slice(0, 40) + (x.options ? ' [' + [...x.options].map(o => o.text).join('/') + ']' : ''))));
// expand the reply select to show its options on screen
const rs = page.locator('select').filter({ has: page.locator('option', { hasText: 'Nothing' }) }).first();
await rs.evaluate(s => { s.size = Math.min(s.options.length, 6); s.style.height = 'auto'; }).catch(e => log('rs', String(e).slice(0, 80))); await sleep(800);
await shot('zm-reply-options');
await go('/settings/automation/blueprints/' + M.B); await sleep(9000);
await page.getByText('QA go', { exact: true }).first().click().catch(e => log('click go', String(e).slice(0, 80))); await sleep(2500);
const dur = page.getByText(/^During$/).first(); if (await dur.count()) { await dur.click(); await sleep(1200); }
const add = page.locator('select').filter({ has: page.locator('option', { hasText: 'Add item' }) }).first();
log('add item options', await add.evaluate(s => [...s.options].map(o => o.text)).catch(e => String(e).slice(0, 80)));
await add.evaluate(s => { s.size = s.options.length; s.style.height = 'auto'; s.style.position = 'relative'; s.style.zIndex = 50; }).catch(() => {}); await sleep(800);
await add.scrollIntoViewIfNeeded().catch(() => {}); await sleep(500);
log('add box', await add.boundingBox());
await shot('zm-during-items');
return { ok: true };
