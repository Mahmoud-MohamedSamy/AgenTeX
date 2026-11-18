await go('/modules/' + TM + '/records/new', 9000);
const lab = page.getByText('Department', { exact: true }).first(); const box = lab.locator('xpath=ancestor::*[self::div or self::label][2]');
const trig = box.locator('button,[role=combobox],input').first(); await trig.click().catch(() => {}); await sleep(2000);
out.opts = (await page.locator('[role=listbox],[role=menu],[cmdk-list],[data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 800);
await shot('access/c-create-dept');
return fin({ out });
