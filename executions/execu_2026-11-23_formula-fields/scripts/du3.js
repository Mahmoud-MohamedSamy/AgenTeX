await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(2000);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down();
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); }
await sleep(400); await page.mouse.up(); await sleep(3000); await shot('desk-A2-panel');
log('panel', (await text()).match(/Field Properties[\s\S]{0,300}/)?.[0]?.replace(/\n+/g, ' | '));
await page.getByRole('button', { name: 'Apply' }).click(); await sleep(1200);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(4000); await shot('desk-A7-save-empty');
log('after save empty', (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts()).join(' || ').slice(0, 300));
