const CFG = { mod: '841043e1-c078-41f9-8d6e-dfd61bee45c3', file: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/files/QA-RT-leads-imp.xlsx', layout: 'FieldPermissions', op: 'Add new records', map: { Name: 'Name', Percent: 'Percent Permission', 'Multi Select': 'Multi Select Permission', 'Single Line': 'Single Line Permission' }, tag: '1590', submit: false };
// UI import runner. The caller prepends: const CFG = { mod, file, layout, op, map: {column: fieldLabel}, tag, submit };
// Walks Upload → Operation → Map → Assign → Review (→ Submit), screenshots each step as <tag>-imp-N.
const st = {};
const step = async (n, name) => { await shot(`${CFG.tag}-imp-${n}-${name}`); st[name] = (await txt()).split('Result')[1]?.slice(0, 1800); };
await go(`/modules/${CFG.mod}/import`, 9000);
for (let i = 0; i < 15 && !(await page.locator('input[type=file]').count()); i++) { const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) { await so.click(); await sleep(2500); } else await sleep(1000); }
await page.locator('input[type=file]').setInputFiles(CFG.file); await sleep(4000);
st.uploadMsg = (await txt()).split('Browse')[1]?.slice(0, 300);
await step(1, 'upload');
if (CFG.stopAt === 'upload') return done(st);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
if (CFG.layout) await page.locator('select').first().selectOption({ label: CFG.layout }); await sleep(600);
await page.getByText(CFG.op || 'Add new records', { exact: true }).click(); await sleep(1200);
await step(2, 'operation');
if (CFG.stopAt === 'operation') return done(st);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
const rows = page.locator('table tbody tr'); const n = await rows.count(); st.mapping = [];
for (let i = 0; i < n; i++) { const r = rows.nth(i); const col = (await r.locator('td').first().innerText()).replace(/\s*\*$/, '').trim(); const s = r.locator('select').first();
  if (CFG.map && CFG.map[col] !== undefined) await s.selectOption({ label: CFG.map[col] });
  st.mapping.push(col + '→' + await s.evaluate(x => x.options[x.selectedIndex].text)); }
await sleep(800); await step(3, 'map');
if (CFG.stopAt === 'map') return done(st);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
await page.getByRole('button', { name: 'Save & next' }).click(); await sleep(8000);
await step(4, 'review');
if (!CFG.submit) return done(st);
await page.getByText('I confirm I have permission', { exact: false }).click(); await sleep(500);
await page.getByRole('button', { name: 'Submit' }).click();
for (let i = 0; i < 60 && !/Import complete|Import finished|completed with errors|Import failed/i.test(await txt()); i++) await sleep(1500);
await step(5, 'result');
return done(st);
