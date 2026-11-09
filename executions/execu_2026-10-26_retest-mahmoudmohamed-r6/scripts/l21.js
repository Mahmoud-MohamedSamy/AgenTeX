await rowMenu('Phone 6', null); await sleep(500);
const items = await page.locator('[role=menu] *, [data-radix-popper-content-wrapper] *').evaluateAll(a => [...new Set(a.map(x => x.innerText?.trim()).filter(t => t && t.length < 40))]);
await shot('2423-dbg3');
return done({ items: items.slice(0, 20) });
