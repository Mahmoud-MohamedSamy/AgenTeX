// NDC-492 form effect: New Section (already 2 columns) → Top to Bottom → new-lead form tab order; Left to Right → order again; restore Single Column + Left to Right.
const URL = `${H}/settings/modules-and-fields/${T.LEADS}/layouts/b3ab6751-e26a-4641-9dbc-f8737f26c908`;
const open = async () => { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('button[aria-label="Section settings"]', { timeout: 60000 }); await sleep(2000); };
const menu = async () => { const g = await page.$$('button[aria-label="Section settings"]'); await g[2].click(); await sleep(1200); };
const pick = async labels => { for (const l of labels) { await menu(); await page.click(`text=${l}`); await sleep(1200); await page.keyboard.press('Escape'); await sleep(600); } };
const save = async () => { const b = await page.$('button:has-text("Save"):not(:has-text("Close"))'); if (b && !(await b.isDisabled())) { await b.click(); await sleep(6000); } return (await text()).match(/Layout saved successfully|error|failed/i)?.[0]; };
// Tab through the Lead Details section on the new-lead form (Standard Layout) and record the field labels in focus order.
const tabOrder = async () => {
  await page.goto(`${H}/modules/${T.LEADS}/records/new?layout_id=b3ab6751-e26a-4641-9dbc-f8737f26c908`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(9000);
  const order = await page.evaluate(() => { const sec = [...document.querySelectorAll('section, fieldset, [data-testid*="section"]')].find(s => /New Section/.test(s.innerText)); if (!sec) return ['no section'];
    const els = [...sec.querySelectorAll('input, textarea, select, button[role=combobox], [contenteditable=true], [tabindex]:not([tabindex="-1"])')].filter(e => e.offsetParent);
    return els.map(e => { const box = e.getBoundingClientRect(); const lab = e.closest('[data-field-key], [data-testid*=field], label, div')?.innerText?.split('\n')[0] || e.getAttribute('aria-label') || e.name; return `${lab}@${Math.round(box.left)},${Math.round(box.top)}`; }).slice(0, 12); });
  return order;
};
const out = {};
await open(); await pick(['Top to Bottom']); out.save1 = await save(); await shot('492-4-double-ttb.png');
out.formTopToBottom = await tabOrder(); await shot('492-5-form-ttb.png');
await open(); await pick(['Left to Right']); out.save2 = await save();
out.formLeftToRight = await tabOrder(); await shot('492-6-form-ltr.png');

await open(); await menu(); out.final = await page.evaluate(() => [...document.querySelectorAll('button, li, [role=menuitem]')].filter(e => /^(Single Column|Double Column|Left to Right|Top to Bottom)$/.test(e.innerText.trim())).map(e => e.innerText.trim() + (e.querySelector('svg') ? ' ✓' : '')));
return out;
