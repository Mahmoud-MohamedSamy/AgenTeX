const t0 = Date.now(); await go('/settings/automation/blueprints/new'); await page.locator('[draggable=true]').first().waitFor({ timeout: 120000 }); log('new designer ms', Date.now() - t0);
const canvas = page.locator('.react-flow').first(); const D = page.locator('[draggable=true]');
await D.nth(0).dragTo(canvas, { targetPosition: { x: 200, y: 250 } }); await sleep(1200);
await D.nth(2).dragTo(canvas, { targetPosition: { x: 600, y: 250 } }); await sleep(1200);
log('nodes', await page.locator('.react-flow__node').allInnerTexts());
await shot('n11-palette-' + process.env.BR);
