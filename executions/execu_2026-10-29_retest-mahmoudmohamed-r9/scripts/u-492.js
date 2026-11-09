// NDC-492: Leads "Standard Layout" › section 2 settings › Tab Order → Top to Bottom: tick moves, Save, persists after reload; then set back to Left to Right + Save.
const URL = `${H}/settings/modules-and-fields/${T.LEADS}/layouts/b3ab6751-e26a-4641-9dbc-f8737f26c908`;
const open = async () => { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000); };
const menu = async () => { const g = await page.$$('button[aria-label="Section settings"]'); await g[1].click(); await sleep(1500); };
const ticked = async () => page.evaluate(() => { const items = [...document.querySelectorAll('[role=menuitem], [role=menuitemradio], button, li')].filter(e => /^(Left to Right|Top to Bottom)$/.test(e.innerText.trim()));
  return items.map(e => e.innerText.trim() + ':' + (e.getAttribute('aria-checked') || (e.querySelector('svg') ? 'svg' : '') || '')); });
const out = {};
await open(); await menu(); out.initial = await ticked(); await shot('492-1-initial.png');
await page.click('text=Top to Bottom'); await sleep(1500);
const still = await page.$('text=Top to Bottom'); if (!still || !(await still.isVisible())) await menu();
out.afterClick = await ticked(); await shot('492-2-after-click.png');
await page.keyboard.press('Escape'); await sleep(800);
const save = await page.$('button:has-text("Save"):not(:has-text("Close"))'); out.saveEnabled = save ? !(await save.isDisabled()) : 'no button';
if (save && !(await save.isDisabled())) { await save.click(); await sleep(6000); }
const t1 = await text(); out.saveMsg = (t1.match(/.{0,40}(saved|updated|error|failed).{0,80}/i) || [''])[0].replace(/\s+/g, ' ');
await open(); await menu(); out.afterReload = await ticked(); await shot('492-3-after-reload.png');
// restore
await page.click('text=Left to Right'); await sleep(1500); await page.keyboard.press('Escape'); await sleep(800);
const save2 = await page.$('button:has-text("Save"):not(:has-text("Close"))'); if (save2 && !(await save2.isDisabled())) { await save2.click(); await sleep(6000); }
await open(); await menu(); out.restored = await ticked();
return out;
