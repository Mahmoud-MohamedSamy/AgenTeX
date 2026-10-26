await go(`/modules/${M.tickets}/records/4df60527-2c5c-4943-bae7-c4ce5967042c`, 10000);
await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000);
const f = await page.$$eval('main input, main textarea, main [contenteditable=true]', es => es.filter(e => e.offsetParent !== null).map(e => [e.tagName, e.type || '', e.getAttribute('aria-label') || '', e.getAttribute('placeholder') || '', e.getAttribute('name') || '', e.id || '', (e.value || '').slice(0, 30)].join('|')));
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {});
return JSON.stringify(f);
