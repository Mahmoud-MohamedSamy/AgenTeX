await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Checks/.test(await text())) break; } await sleep(2000);
// F9/F10: open subform settings by clicking its table area
const q = page.getByText('Line', { exact: true }).first(); await q.scrollIntoViewIfNeeded(); const b = await q.boundingBox();
await page.mouse.click(b.x - 150, b.y + 40); await sleep(2000);
let opened = /Field Properties/.test(await text()); log('opened by table click', opened);
if (!opened) { await page.mouse.dblclick(b.x - 150, b.y + 40); await sleep(2000); opened = /Field Properties/.test(await text()); log('opened by dblclick', opened); }
if (opened) { await page.getByText('ADVANCED', { exact: true }).click().catch(() => { }); await sleep(1500); await shot('F9-subform-advanced');
  const box = page.locator('[data-testid^="subform-formula-"] textarea').first(); log('boxes', await page.locator('[data-testid^="subform-formula-"]').count(), 'value', await box.inputValue().catch(() => '?'));
  const msg = async () => (await page.locator('[data-testid^="subform-formula-"]').first().innerText()).split('\n').slice(0, 2).join(' / ');
  for (const [k, e] of Object.entries({ F9: 'qa_items3.qty * 2', F10self: 'line + 1', unknown: 'nope * 2', empty: '', ok: 'qty * price' })) { await box.fill(e); await sleep(500); log(k, JSON.stringify(e), '->', await msg()); }
  await box.fill('line + 1'); await sleep(300); await shot('F10-self-ref'); await page.getByRole('button', { name: 'Cancel' }).last().click().catch(() => { }); await sleep(1000); }
// A8: spaces-only expression on a new formula
await page.evaluate(() => window.scrollTo(0, 0)); await sleep(500);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); } await sleep(400); await page.mouse.up(); await sleep(2500);
await page.locator('#formula-expression').fill('   '); await sleep(500); log('A8 note', /A formula field needs an expression/.test(await text())); await shot('A8-spaces');
// M1 Arabic
await page.evaluate(() => localStorage.setItem('anyware_language', 'ar')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Checks/.test(await text())) break; } await sleep(2000);
const sb2 = await page.getByText('Formula', { exact: true }).first().boundingBox().catch(() => null); log('AR palette Formula tile (EN text)', !!sb2);
const tiles = await page.locator('aside, nav').first().innerText().catch(() => ''); 
const f1 = page.getByText('QA FX F1', { exact: true }).first(); await f1.scrollIntoViewIfNeeded().catch(() => { }); await shot('M1-ar-builder');
const html = await page.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang })); log('AR html', html);
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
