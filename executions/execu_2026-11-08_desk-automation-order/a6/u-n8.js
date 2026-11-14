const t0 = Date.now(); await go('/settings/automation/blueprints/006684e7-8cf4-4895-afb6-95386cd6b320');
await page.locator('.react-flow__node').nth(29).waitFor({ timeout: 120000 }); const tl = Date.now() - t0;
log('nodes', await page.locator('.react-flow__node').count(), 'edges', await page.locator('.react-flow__edge').count(), 'load ms (incl. nav)', tl);
await page.getByRole('button', { name: 'Fit to screen' }).click(); await sleep(1000); await shot('n8-big-' + (process.env.BR || 'edge'));
const t1 = Date.now(); await page.locator('.react-flow__node').nth(5).click(); await page.waitForTimeout(300); log('select node ms', Date.now() - t1);
const t2 = Date.now(); const n = page.locator('.react-flow__node').nth(7); const bb = await n.boundingBox(); await page.mouse.move(bb.x + 20, bb.y + 10); await page.mouse.down(); await page.mouse.move(bb.x + 120, bb.y + 60, { steps: 8 }); await page.mouse.up(); log('drag node ms', Date.now() - t2);
const after = await n.boundingBox(); log('node moved', Math.round(after.x - bb.x), Math.round(after.y - bb.y));
// palette drag (N11): drop an unused status onto the canvas
const D = page.locator('[draggable=true]'); const cnt = await D.count(); log('palette draggables', cnt);
const before = await page.locator('.react-flow__node').count(); if (cnt) { await D.last().dragTo(page.locator('.react-flow').first(), { targetPosition: { x: 500, y: 600 } }); await sleep(1500); }
log('nodes after palette drag', before, '->', await page.locator('.react-flow__node').count());
await shot('n11-dnd-' + (process.env.BR || 'edge'));
