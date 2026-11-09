await sleep(500); await shot('c04-operator-open');
const pop = await page.evaluate(() => [...document.querySelectorAll('[role=option], [role=menuitem], [role=listbox] li, [role=listbox] button, [data-radix-popper-content-wrapper] *')].map(e => (e.innerText || '').trim()).filter(Boolean));
const sel = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].map(s => [...s.options].map(o => o.text)));
return { pop: [...new Set(pop)].slice(0, 30), sel };
