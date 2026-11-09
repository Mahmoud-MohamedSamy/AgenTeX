// NDC-492 form effect on the 2-column "New Section" (Leads "Standard Layout"): Tab order on the new-lead form with Top to Bottom vs Left to Right.
// Ends on Left to Right (the original value), verified.
const LAY = 'b3ab6751-e26a-4641-9dbc-f8737f26c908'; const URL = `${H}/settings/modules-and-fields/${T.LEADS}/layouts/${LAY}`;
const open = async () => { await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('button[aria-label="Section settings"]', { timeout: 120000 }); await sleep(2500); };
const setOrder = async label => { await open(); const g = await page.$$('button[aria-label="Section settings"]'); await g[2].click(); await page.waitForSelector(`text=${label}`, { timeout: 15000 }); await page.click(`text=${label}`); await sleep(1500); await page.keyboard.press('Escape'); await sleep(800);
  const b = await page.$('button:has-text("Save"):not(:has-text("Close"))'); if (b && !(await b.isDisabled())) { await b.click(); return page.waitForSelector('text=Layout saved successfully', { timeout: 30000 }).then(() => 'saved').catch(() => 'no toast'); } return 'unchanged'; };
const formOrder = async tag => {
  let ok = false;
  for (const q of [`layoutId=${LAY}`, `layout=${LAY}`, `layout_id=${LAY}`]) { await page.goto(`${H}/modules/${T.LEADS}/records/new?${q}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); ok = await page.waitForSelector('text=New Section', { timeout: 90000 }).then(() => true).catch(() => false); if (ok) { log('form via ' + q); break; } }
  if (!ok) return ['form did not show New Section'];
  await sleep(2000); await shot(`492-form-${tag}.png`);
  return page.evaluate(() => {
    const head = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText?.trim() === 'New Section'); let sec = head; for (let i = 0; i < 8 && sec && !(sec.querySelectorAll('input, textarea, select, [role=combobox]').length >= 2); i++) sec = sec.parentElement;
    if (!sec) return ['no container'];
    const fs = [...sec.querySelectorAll('input:not([type=hidden]), textarea, select, [role=combobox]')].filter(e => e.offsetParent && e.tabIndex !== -1);
    return fs.map(e => { const r = e.getBoundingClientRect(); const lab = (e.getAttribute('aria-label') || e.placeholder || e.name || e.id || '').slice(0, 24); return `${lab}@x${Math.round(r.left)}y${Math.round(r.top)}`; });
  });
};
const out = {};
out.setTTB = await setOrder('Top to Bottom'); out.formTTB = await formOrder('ttb');
out.setLTR = await setOrder('Left to Right'); out.formLTR = await formOrder('ltr');
await open(); const g = await page.$$('button[aria-label="Section settings"]'); await g[2].click(); await sleep(1500);
out.final = await page.evaluate(() => [...document.querySelectorAll('button, li, [role=menuitem]')].filter(e => /^(Left to Right|Top to Bottom)$/.test(e.innerText.trim())).map(e => e.innerText.trim() + (e.querySelector('svg') ? ' ✓' : '')));
return out;
