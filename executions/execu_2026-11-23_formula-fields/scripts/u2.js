await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(2000);
const src = page.locator('aside, nav, div').filter({ hasText: /^Formula$/ }).last();
const tile = page.getByText('Formula', { exact: true }).first(); const sb = await tile.boundingBox();
const tgt = page.getByText('QA Text2', { exact: true }).first(); const tb = await tgt.boundingBox(); log('boxes', sb, tb);
await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2); await page.mouse.down();
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); }
await sleep(400); await page.mouse.up(); await sleep(3000);
await shot('A1-after-drop'); const t = await text(); const i = t.indexOf('Formula'); log(t.slice(t.indexOf('QA FX Inputs'), t.indexOf('QA FX Inputs') + 300));
log('dialogs', await page.locator('[role=dialog]').count(), (await page.locator('[role=dialog]').allInnerTexts()).join(' || ').slice(0, 1500));
