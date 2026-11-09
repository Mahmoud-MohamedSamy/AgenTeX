await page.locator('main button', { hasText: /^Edit$/ }).first().click(); await sleep(6000);
await shot('s02-joined-edit');
const inputs = await page.$$eval('main input, main [contenteditable=true]', is => is.map(i => i.tagName + ':' + (i.getAttribute('aria-label') || i.placeholder || '') + '=' + (i.value || i.innerText || '')));
const head = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 200);
await page.goto(H + '/reports', { waitUntil: 'domcontentloaded' }); await sleep(7000);
const list = (await page.innerText('main')).replace(/\s+/g, ' ');
return { inputs, head, list: list.slice(list.indexOf('Name Used in'), list.indexOf('Name Used in') + 600) };
