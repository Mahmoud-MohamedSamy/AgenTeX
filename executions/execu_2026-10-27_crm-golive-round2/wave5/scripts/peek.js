await shot('peek');
const dlg = await page.locator('[role=dialog]').count();
const pop = await page.$$eval('[role=listbox], [role=menu], [data-radix-popper-content-wrapper], [role=option], [role=menuitem]', es => es.map(e => e.getAttribute('role') + ':' + e.innerText.replace(/\s+/g, ' ').slice(0, 300)));
return { dlg, pop: pop.slice(0, 20), dtext: dlg ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 600) : '' };
