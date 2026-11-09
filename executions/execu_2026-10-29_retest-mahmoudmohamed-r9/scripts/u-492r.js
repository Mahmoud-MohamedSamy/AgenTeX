// NDC-492 restore: "New Section" (3rd section) of Leads "Standard Layout" → Tab Order Left to Right, Save, verify after reload.
const URL = `${H}/settings/modules-and-fields/${T.LEADS}/layouts/b3ab6751-e26a-4641-9dbc-f8737f26c908`;
const open = async () => { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('button[aria-label="Section settings"]', { timeout: 120000 }); await sleep(2500); };
const menu = async () => { const g = await page.$$('button[aria-label="Section settings"]'); await g[2].click(); await page.waitForSelector('text=Left to Right', { timeout: 15000 }); await sleep(800); };
const state = async () => page.evaluate(() => [...document.querySelectorAll('button, li, [role=menuitem]')].filter(e => /^(Left to Right|Top to Bottom)$/.test(e.innerText.trim())).map(e => e.innerText.trim() + (e.querySelector('svg') ? ' ✓' : '')));
const out = {};
await open(); await menu(); out.before = await state();
await page.click('text=Left to Right'); await sleep(1500); await page.keyboard.press('Escape'); await sleep(800);
const b = await page.$('button:has-text("Save"):not(:has-text("Close"))'); out.saveEnabled = b ? !(await b.isDisabled()) : 'none';
if (b && !(await b.isDisabled())) { await b.click(); await page.waitForSelector('text=Layout saved successfully', { timeout: 30000 }).then(() => out.saved = true).catch(() => out.saved = false); }
await open(); await menu(); out.after = await state();
return out;
