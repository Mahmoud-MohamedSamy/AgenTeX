const o = {};
await go('/views/all/tickets/' + '8e2176f3-4bb0-4e18-883e-9eb5ffdbcb20'); await page.getByText('QA PA HI ticket').first().waitFor({ timeout: 120000 }).catch(() => o.err = 'no subject'); await sleep(4000);
const tab = page.getByRole('tab', { name: /approval/i }).first(); if (await tab.count()) { await tab.click(); await sleep(4000); }
const item = page.getByText('QA PA HI for D only').first(); o.visible = await item.count();
if (o.visible) { await item.scrollIntoViewIfNeeded(); await sleep(800); const card = item.locator('xpath=ancestor::*[.//text()[contains(.,"Approvers")]][1]'); const bb = await (await card.count() ? card : item).boundingBox(); o.box = bb && [Math.round(bb.x) - 6, Math.round(bb.y) - 6, Math.round(bb.width) + 12, Math.round(bb.height) + 12]; o.cardText = (await card.innerText().catch(() => '')).slice(0, 300); }
o.pageUrl = page.url(); await shot('ui17-B-ticket-tab-other-approval');
return o;
