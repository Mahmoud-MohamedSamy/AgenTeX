await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(2000);
const drop = async (target) => { const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText(target, { exact: true }).first().boundingBox();
  await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); } await sleep(400); await page.mouse.up(); await sleep(2500); };
await drop('QA Text2');
const ta = page.locator('#formula-expression');
const cases = { G1: 'concat("abc)', G2: 'qa_num # 2', G3a: '(qa_num + 1', G3b: 'qa_num + 1)', G4a: '* 2', G4b: 'qa_num +', G4c: 'qa_num + * 2', G5: 'concat(,"a")', D3: 'if(qa_num > 1, 1)', F6: 'qa_items.qty + 1', F7: 'sum(qa_items.nope)', G6: 'formula + 1', G7: 'qa_nope * 2', D22: 'today()', S: '"abc' };
const out = {};
for (const [k, e] of Object.entries(cases)) { await ta.fill(e); await sleep(400); const p = ta.locator('xpath=following-sibling::p[1]'); out[k] = { expr: e, msg: (await p.innerText().catch(() => '')).trim(), invalid: await ta.getAttribute('aria-invalid') }; }
await ta.fill('qa_num # 2'); await sleep(300); await shot('G2-editor-error');
await ta.fill('qa_num * 2'); await sleep(400); out.G12 = { msg: (await ta.locator('xpath=following-sibling::p[1]').innerText()).trim(), invalid: await ta.getAttribute('aria-invalid') }; await shot('G12-fixed');
await ta.fill('qa_num # 2'); await page.getByRole('button', { name: 'Apply' }).click(); await sleep(1000);
await drop('QA Multi'); await page.locator('#formula-expression').fill('(qa_num'); await page.getByRole('button', { name: 'Apply' }).click(); await sleep(1000);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(4000); await shot('G13-save-two-bad');
out.G13 = (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts()).join(' || ').slice(0, 400);
for (const [k, v] of Object.entries(out)) log(k, JSON.stringify(v));
fs.writeFileSync(RUN + '/out/crm-u12.json', JSON.stringify(out, null, 1));
