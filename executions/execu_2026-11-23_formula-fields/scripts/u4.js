await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(2000);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down();
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); }
await sleep(400); await page.mouse.up(); await sleep(3000);
// label
await page.getByText('GENERAL', { exact: true }).click(); await sleep(800);
const en = page.locator('input[type=text], input:not([type])').filter({ has: page.locator('xpath=.') }); const labelInput = page.locator('input[value="Formula"]').first();
if (await labelInput.count()) { await labelInput.fill('QA FX UI Double'); log('label set'); } else log('label input not found');
// J3 toggles
await page.getByText('VALIDATION', { exact: true }).click(); await sleep(800);
const sw = page.locator('[role=switch], button[aria-checked]'); const n = await sw.count(); const st = [];
for (let i = 0; i < n; i++) st.push({ i, dis: await sw.nth(i).isDisabled(), checked: await sw.nth(i).getAttribute('aria-checked') });
log('switches', st);
// expression with chip insert
await page.getByText('ADVANCED', { exact: true }).click(); await sleep(800);
const ta = page.locator('#formula-expression'); await ta.click(); await ta.type(' * 2'); await ta.press('Home');
await page.locator('button', { hasText: /^qa_num$/ }).first().click(); await sleep(500);
log('expression now', await ta.inputValue()); await shot('A3-chip-insert');
await ta.fill('qa_num # 2'); await sleep(500); log('err1', (await text()).match(/Unexpected character[^\n]*/)?.[0]); await shot('G-editor-error');
await ta.fill('qa_num * 2'); await sleep(500);
await page.getByRole('button', { name: 'Apply' }).click(); await sleep(1500);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000); await shot('A6-saved');
log('toasts', (await page.locator('[data-sonner-toast], [role=status], [role=alert]').allInnerTexts()).join(' || ').slice(0, 400));
