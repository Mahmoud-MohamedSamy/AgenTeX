await page.goto(H + '/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
log('url', page.url(), 'pw inputs', await page.locator('input[type=password]').count(), 'email inputs', await page.locator('input[type=email], input[name=email]').count());
const ins = await page.$$eval('input', x => x.map(e => e.type + ':' + (e.name || '') + ':' + (e.id || '') + ':' + (e.autocomplete || '')));
log('inputs', ins.join(' | '));
return 'ok';
