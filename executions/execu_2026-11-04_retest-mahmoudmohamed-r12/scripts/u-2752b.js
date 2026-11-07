const o = {};
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Skills/.test(await text())) break; }
await page.getByText('Skills', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Active skills/.test(await text())) break; } await sleep(2000);
await page.locator('xpath=//*[normalize-space(text())="Department"]/following::*[self::button or @role="combobox"][1]').first().click(); await sleep(1200);
await page.getByRole('option', { name: 'QA RT11 Dept A' }).first().click().catch(async () => { await page.getByText('QA RT11 Dept A', { exact: true }).last().click(); }); await sleep(4000);
const rows = async () => (await page.locator('table tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 80));
o.deptA = await rows(); o.activeCount = ((await text()).match(/Active skills: [^\n]*/) || [''])[0];
await page.getByPlaceholder('Search skills').fill('qa_rt12'); await sleep(2500); o.search = await rows(); await shot('2752-b-search.png');
await page.getByPlaceholder('Search skills').fill(''); await sleep(1500);
await page.getByText('All statuses').first().click(); await sleep(1000); await page.getByRole('option', { name: /Inactive/ }).first().click().catch(async () => { await page.getByText('Inactive', { exact: true }).last().click(); }); await sleep(2500);
o.inactiveFilter = await rows(); await shot('2752-c-inactive.png');
await page.getByText('Clear filters').first().click(); await sleep(2500);
const rb = await page.getByText('qa_rt12_2752_sk1', { exact: true }).first().boundingBox(); await page.mouse.click(1548, rb.y + 8); await sleep(1500); await shot('2752-d0-menu.png'); o.menuTxt = (await text()).match(/(Edit|Delete|Deactivate|Activate|Where used|Duplicate)[^\n]*/g);
o.rowMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).slice(0, 200);
await page.getByText(/^Delete/).last().click().catch(e => o.delErr = String(e).slice(0, 60)); await sleep(2500);
o.deleteDialog = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 600); await shot('2752-d-delete-warning.png');
await page.getByRole('button', { name: 'Cancel' }).last().click().catch(() => {});
return o;
