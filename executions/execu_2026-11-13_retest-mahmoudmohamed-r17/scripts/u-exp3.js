await page.goto(H + '/settings/data/export', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Export history/.test(await text())) break; } await sleep(2000);
const mb = page.locator('button:has-text("Choose a module")'); log('mb', await mb.count(), await mb.first().isVisible(), await mb.first().isEnabled()); await mb.first().click({ force: true }); await sleep(1500);
log(await page.$$eval('[role=listbox] *, [role=menu] *, [data-radix-popper-content-wrapper] *', es => es.slice(0, 30).map(e => e.tagName + ':' + (e.getAttribute('role') || '') + ':' + (e.innerText || '').slice(0, 30))));
await shot('2846-module-menu.png');
