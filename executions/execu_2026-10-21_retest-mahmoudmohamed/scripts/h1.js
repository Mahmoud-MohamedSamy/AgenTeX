await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 8000);
for (let i = 0; i < 40 && /Loading Leads/.test(await txt()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1200);
await page.getByRole('menuitem', { name: /Import Leads/ }).click(); await sleep(6000);
const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) { await so.click(); await sleep(2500); }
await page.locator('input[type=file]').setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/files/QA-RT-leads.csv'); await sleep(4000);
const up = (await txt()).split('Result')[1]?.slice(0, 700);
await shot('1517-02-csv-uploaded');
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
const out = { up };
const sec = async () => (await txt()).split('Layout and operation')[1]?.split('Back\nNext')[0];
for (const op of ['Add new records', 'Update existing only', 'Add and update']) { await page.getByText(op, { exact: true }).click(); await sleep(1500); out[op] = await sec(); await shot('1518-leads-' + op.replace(/ /g, '-')); }
await page.locator('select').first().selectOption({ label: 'FieldPermissions' }); await sleep(1500);
out.addUpdateFieldPermissions = await sec(); await shot('1519-leads-fieldpermissions');
return done(out);
