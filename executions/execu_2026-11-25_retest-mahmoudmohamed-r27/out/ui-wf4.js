const o = {};
await page.goto(H + '/settings/automation/workflow-rules?department=a373cfd1-85e8-495d-af9a-1a003d2a08a3', { waitUntil: 'commit' }); await page.locator('tbody tr').first().waitFor({ timeout: 120000 }); await sleep(2000);
const btn = page.locator('main').getByRole('button', { name: 'Execution history', exact: true }).or(page.locator('main').getByRole('link', { name: 'Execution history', exact: true })).first();
o.count = await btn.count(); const bb = await btn.boundingBox(); o.box = bb && [Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height)];
const nr = await page.locator('main').getByRole('button', { name: /New Rule/ }).first().boundingBox(); o.newRuleBox = nr && [Math.round(nr.x), Math.round(nr.y), Math.round(nr.width), Math.round(nr.height)];
await shot('3232-header');
await btn.click(); await sleep(6000); o.url = page.url().replace(H, '');
o.filters = (await page.locator('main').first().innerText().catch(() => '')).match(/FILTER[\s\S]{0,200}/)?.[0];
o.rowsShown = await page.locator('tbody tr').count(); o.distinctRules = [...new Set((await page.locator('tbody tr td:nth-child(2)').allInnerTexts()).map(s => s.trim()))].length;
await shot('3232-execution-history');
await page.goBack(); await sleep(4000); o.backUrl = page.url().replace(H, '');
// Arabic label check from bundle-free UI: header button aria
return o;
