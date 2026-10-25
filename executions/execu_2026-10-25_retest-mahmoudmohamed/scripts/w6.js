await shot('1788-04-priority-row');
const op = await page.getByRole('button', { name: 'Operator for Priority' }).innerText();
const boxes = await page.locator('main input').evaluateAll(es => es.slice(0, 6).map(e => e.type + ' ' + (e.closest('label')?.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30) + ' ' + e.checked));
return done({ op, boxes });
