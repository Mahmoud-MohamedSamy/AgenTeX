const out = {};
await go('/settings/modules-and-fields/' + MID + '/layouts/' + I.layout, 10000);
const el = page.getByText('QA RT18SR PL3', { exact: true }).first(); await el.scrollIntoViewIfNeeded(); await sleep(500);
const card = el.locator('xpath=ancestor::*[.//button][1]'); await el.hover(); await sleep(600);
await card.getByRole('button', { name: 'Field options' }).click(); await sleep(800);
await page.getByText('Edit Properties', { exact: true }).last().click(); await sleep(2000);
for (const tab of ['GENERAL', 'VALIDATION', 'ADVANCED']) { await page.getByText(tab, { exact: true }).last().click(); await sleep(1200); out[tab] = (await page.locator('body').innerText()).replace(/\s+/g, ' ').match(/Field Properties.{0,900}/)?.[0]; if (/Alpha/.test(out[tab])) { out.where = tab; break; } }
await shot('2936-2-props.png');
return out;
