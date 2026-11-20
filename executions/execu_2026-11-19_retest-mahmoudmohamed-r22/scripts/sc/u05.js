const out = {};
await go('/modules/' + MID, 9000);
await page.getByRole('button', { name: 'Custom views' }).first().click(); await sleep(1500);
out.menu = (await page.locator('[role=menu], [role=dialog], [role=listbox], [data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
await shot('1483-13-custom-views.png');
const nv = page.getByText(/(New|Create) (custom )?view/i).first(); out.nv = await nv.count();
if (out.nv) { await nv.click(); await sleep(2500); out.form = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); await shot('1483-14-new-view.png'); }
return out;
