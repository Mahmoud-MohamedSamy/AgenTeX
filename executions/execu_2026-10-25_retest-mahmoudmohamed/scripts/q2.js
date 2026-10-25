await page.locator('[role=dialog]').getByRole('button', { name: 'Create Queue' }).click(); await sleep(3000);
const t = (await txt()).split('Meetings')[1]?.slice(0, 1200) || (await page.locator('[role=dialog]').allInnerTexts()).join('|');
const ctrls = await page.locator('[role=dialog] select, [role=dialog] button[aria-haspopup], [role=dialog] input, select, button[aria-haspopup=listbox]').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.name || e.innerText || '').trim().slice(0, 30)).slice(0, 20));
await shot('1837-02-step1');
return done({ url: page.url(), t: t.slice(0, 1000), ctrls });
