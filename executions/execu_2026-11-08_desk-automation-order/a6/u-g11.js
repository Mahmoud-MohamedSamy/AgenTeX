await go('/settings/automation/blueprints/0806d1e6-1551-4136-b167-5d61ac924064'); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'On Hold' }).first().click(); await sleep(2000);
const b = (await text()).replace(/\s+/g, ' '); const i = b.indexOf('Ends the blueprint A ticket'); log('panel', b.slice(i, i + 900));
log('time limit input', await page.locator('input').evaluateAll(a => a.filter(x => x.offsetParent).map(x => (x.placeholder || '') + '=' + x.value)));
await shot('g11-auto-close-state');
