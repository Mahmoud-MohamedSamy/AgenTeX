const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await shot('1444-03-configured');
await page.getByText('GENERAL', { exact: true }).last().click(); await sleep(1000);
const inputs = await page.locator('input[type=text], input:not([type])').evaluateAll(es => es.map(e => (e.placeholder || '') + '=' + e.value).slice(-6));
const labelIn = page.locator('input[type=text], input:not([type])').filter({ hasNot: page.locator('x') }).last();
const gen = (await txt()).split('Field Properties')[1]?.slice(0, 400);
return done({ inputs, gen });
