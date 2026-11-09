// open Columns editor
const card = page.locator('main', { hasText: 'Columns' }).locator('text=Columns').nth(1);
const pencils = page.locator('main button:has(svg)');
const cols = page.locator('xpath=//*[normalize-space(text())="No columns selected"]/ancestor::div[.//button][1]//button').first();
await cols.click(); await sleep(2000);
await shot('s02-columns-editor');
const d = page.locator('[role=dialog]').first();
const txt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
return { txt: txt.slice(0, 2500) };
