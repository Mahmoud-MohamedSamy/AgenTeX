await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(2000);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down();
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); }
await sleep(400); await page.mouse.up(); await sleep(3000);
const panel = page.locator('text=Field Properties').locator('xpath=ancestor::*[.//button[normalize-space()="Apply"]][1]');
// GENERAL: label
await page.getByRole('tab', { name: 'GENERAL' }).click().catch(() => page.getByText('GENERAL', { exact: true }).click()); await sleep(1000); await shot('A2-general');
const lbl = page.locator('input').filter({ hasNot: page.locator('[type=checkbox]') }); log('general text', (await text()).match(/Field Properties[\s\S]{0,600}/)?.[0]);
const inp = page.getByLabel(/label/i).first(); if (await inp.count()) { await inp.fill('QA FX UI Double'); }
await page.getByText('VALIDATION', { exact: true }).click(); await sleep(1000); await shot('J3-validation'); log('validation', (await text()).match(/VALIDATION[\s\S]{0,700}/)?.[0]);
await page.getByText('ADVANCED', { exact: true }).click(); await sleep(1000);
// A7: Apply + Save with empty expression
await page.getByRole('button', { name: 'Apply' }).click(); await sleep(1500); await shot('A7-apply-empty');
log('after apply empty', (await page.locator('[role=dialog], [role=alert], [data-sonner-toast]').allInnerTexts()).join(' || ').slice(0, 600));
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }).catch(e => log('save click', e.message.split('\n')[0])); await sleep(3000); await shot('A7-save-empty');
log('after save empty', (await page.locator('[role=alert], [data-sonner-toast], li[role=status]').allInnerTexts()).join(' || ').slice(0, 600));
fs.writeFileSync(RUN + '/out/u3-text.txt', await text());
