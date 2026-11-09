const d = page.locator('[role=dialog]').first();
await d.locator('select').nth(0).selectOption({ label: 'QA Pick' }); await sleep(800);
await d.locator('select').nth(1).selectOption({ label: 'QA Sub pick' }); await sleep(1500);
await shot('c05-fields-chosen');
const txt = (await d.innerText()).replace(/\s+/g, ' ');
const boxes = await page.$$eval('[role=dialog] input[type=checkbox], [role=dialog] [role=checkbox]', es => es.map(e => (e.getAttribute('aria-label') || e.closest('label')?.innerText || e.parentElement.innerText || '').trim().slice(0, 30) + '=' + (e.checked ?? e.getAttribute('aria-checked'))));
return { txt: txt.slice(0, 1500), boxes };
