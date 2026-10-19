const out = {};
const pop = async () => { await sleep(1500); const els = await page.$$('[role=listbox] [role=option], [role=menu] [role=menuitem], [role=menu] [role=menuitemcheckbox], [role=dialog] [role=option]'); const t = []; for (const e of els) t.push((await e.innerText()).trim().replace(/\s+/g, ' ')); return t; };
await page.getByRole('button', { name: 'Value for Priority' }).click(); out.priorityValues = await pop(); await shot('NDC-1788-priority-values'); await page.keyboard.press('Escape'); await sleep(800);
await page.getByRole('button', { name: 'Criteria field' }).first().click(); out.fields = await pop(); await shot('NDC-1788-field-list');
out.searchBox = !!(await page.$('[role=dialog] input, [role=listbox] input, [data-radix-popper-content-wrapper] input'));
await page.keyboard.press('Escape'); await sleep(800);
await page.getByRole('button', { name: 'Operator for Priority' }).click(); out.ops = await pop(); await page.keyboard.press('Escape');
return done(out);
