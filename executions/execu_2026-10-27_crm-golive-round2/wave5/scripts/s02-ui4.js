await page.locator('button[aria-label="Add child module"]').first().click(); await sleep(1500);
await shot('s02-child');
const all = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] *, [role=menu] *, [role=listbox] *, [data-radix-popper-content-wrapper] *')].filter(e => e.childElementCount === 0).map(e => e.innerText && e.innerText.trim()).filter(Boolean));
return { all: [...new Set(all)].slice(0, 40) };
