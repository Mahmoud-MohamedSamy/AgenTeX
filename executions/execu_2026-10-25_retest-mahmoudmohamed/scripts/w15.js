const seg = (await txt()).split('Created By')[1]?.slice(0, 300);
await shot('1788-06-created-by');
const boxes = await page.locator('#main-content input').evaluateAll(es => es.slice(0, 12).map(e => e.type + ' ' + (e.closest('label')?.innerText || e.placeholder || '').trim().slice(0, 30)));
return done({ seg, boxes });
