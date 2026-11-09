const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', B = '750470cc-f60a-4129-a5fa-d02aeda70a2c';
const res = {};
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(6000);
res.toggleBefore = await page.locator('button[aria-label="Toggle QA R2W5 Layout B status"]').getAttribute('aria-checked');
res.statusBefore = (await call('GET', `/modules/${M}/layouts/${B}`)).j.data.status;
await page.locator('button[aria-label="Open menu for QA R2W5 Layout B"]').click(); await sleep(800);
res.setDefaultEnabledWhenActive = !(await page.locator('text=Set as default').first().evaluate(e => e.closest('[aria-disabled=true],[data-disabled]') !== null || getComputedStyle(e).opacity < 0.7));
await shot('c02-1588-menu-active'); await page.keyboard.press('Escape'); await sleep(400);
await page.locator('button[aria-label="Toggle QA R2W5 Layout B status"]').click(); await sleep(2500);
const cbtn = page.locator('button', { hasText: /^(Deactivate|Disable|Confirm|Yes)$/ }); if (await cbtn.count()) { res.confirm = true; await cbtn.first().click(); await sleep(2000); }
res.statusAfter = (await call('GET', `/modules/${M}/layouts/${B}`)).j.data.status;
const acc = await call('GET', `/modules/${M}/layouts/accessible`); res.accessible = acc.s + ' ' + JSON.stringify((acc.j && (Array.isArray(acc.j.data) ? acc.j.data : acc.j.data?.layouts) || []).map(l => l.name + ':' + l.status));
await page.goto(H + `/modules/${M}`, { waitUntil: 'domcontentloaded' }); await sleep(5000);
res.listHeader = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 120);
await shot('c02-140-list');
return res;
