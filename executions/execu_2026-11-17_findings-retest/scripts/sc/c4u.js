const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D + '/records/new', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-rule-field]', { timeout: 60000 }).catch(() => {});
await sleep(3500);
log('currency field count ' + await page.locator('[data-rule-field="currency"]').count() + ', exchange_rate ' + await page.locator('[data-rule-field="exchange_rate"]').count());
log('fields ' + (await page.locator('[data-rule-field]').evaluateAll(e => e.map(x => x.getAttribute('data-rule-field')))).join(','));
const amt = page.locator('[data-rule-field="amount"]').first();
if (await amt.count()) { await amt.scrollIntoViewIfNeeded(); await sleep(800); log('amount text ' + (await amt.innerText()).replace(/\n/g, ' | ') + ' box ' + JSON.stringify(await amt.boundingBox())); const ph = await amt.locator('input').first().getAttribute('placeholder').catch(() => null); log('amount placeholder ' + ph); }
await shot('C4-1-deal-create.png');
const t = await text(); log('layout ' + (t.match(/Layout[^\n]*\n[^\n]*/) || [''])[0]);
