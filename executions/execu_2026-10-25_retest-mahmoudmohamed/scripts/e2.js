await page.getByText('New custom view', { exact: true }).click(); await sleep(3000);
const t = (await txt()).split('Meetings')[1]?.slice(0, 1200) || '';
const d = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 1200);
const inputs = await page.locator('input').evaluateAll(es => es.map(e => (e.placeholder || e.getAttribute('aria-label') || e.name || '') + ' maxlen=' + e.maxLength).filter(x => !/Search or jump/.test(x)));
await shot('cv-01-editor');
return done({ url: page.url(), t: d || t, inputs });
