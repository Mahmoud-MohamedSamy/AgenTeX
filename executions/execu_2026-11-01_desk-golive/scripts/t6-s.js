await go('/views/all/tickets/' + T1, 9000); await clickItem('Clone'); await sleep(3000);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000);
out.invalid = await page.locator('[aria-invalid=true]').evaluateAll(es => es.map(e => (e.closest('[class*=field],div')?.innerText || '').replace(/\s+/g, ' ').slice(0, 120) + ' :: ' + (e.getAttribute('name') || e.id)));
out.errs = (await page.locator('[role=alert], .text-destructive, [class*=error]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 150)).slice(0, 10);
const el = page.locator('[aria-invalid=true]').first(); if (await el.count()) await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('tm/tavi-clone-error');
return fin({ out });
