// NDC-1823: QA lead → Convert → "Create a new Deal" → are Probability, Expected Revenue, Lead Conversion Time, Sales Cycle Duration, Overall Sales Duration
// read-only? Type into them; pick Stage + Amount → auto values. Time until the deal form shows. NOT converted.
const L = 'bbb0320d-b737-4b40-b42b-a207f8553579';
await page.goto(`${H}/modules/${T.LEADS}/records/${L}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=QA RT 1823 convert lead', { timeout: 120000 }); await sleep(3000);
await page.locator('button', { hasText: /^Convert$/ }).first().click().catch(async () => { await page.click('text=Convert'); });
await page.waitForSelector('text=/Create a new Deal/i', { timeout: 90000 }); await sleep(2000); await shot('1823-1-convert.png');
const t0 = Date.now(); await page.locator('text=/Create a new Deal/i').first().click();
const appeared = await page.waitForSelector('text=/Probability/i', { timeout: 120000 }).then(() => Date.now() - t0).catch(() => 'not shown in 120 s');
await sleep(2000); await shot('1823-2-deal-form.png');
const NAMES = ['Probability', 'Expected Revenue', 'Lead Conversion Time', 'Sales Cycle Duration', 'Overall Sales Duration'];
const state = async () => page.evaluate(names => names.map(n => { const lab = [...document.querySelectorAll('label, span, div')].find(e => e.children.length <= 2 && e.innerText?.trim().replace(/\s*[*🔒]\s*$/, '').startsWith(n));
  let box = lab; for (let i = 0; i < 5 && box && !box.querySelector('input, textarea'); i++) box = box.parentElement; const inp = box?.querySelector('input, textarea');
  return { field: n, found: !!inp, readOnly: inp ? (inp.readOnly || inp.disabled || inp.getAttribute('aria-readonly') === 'true') : null, value: inp?.value ?? null, lock: !!box?.querySelector('svg[class*="lock" i], [data-icon*="lock" i], [aria-label*="lock" i]') }; }), NAMES);
const out = { formAppearedMs: appeared, before: await state() };
// try typing into each of them
for (const n of NAMES) { const inp = page.locator(`xpath=//*[starts-with(normalize-space(),"${n}")]/ancestor::*[.//input][1]//input`).first(); if (await inp.count()) await inp.fill('500', { timeout: 3000 }).catch(() => {}); }
out.afterTyping = await state();
// Stage + Amount
const stage = page.locator('xpath=//*[starts-with(normalize-space(),"Stage")]/ancestor::*[.//select or .//*[@role="combobox"]][1]//*[self::select or @role="combobox"]').first();
if (await stage.count()) { const tag = await stage.evaluate(e => e.tagName); if (tag === 'SELECT') { const o = await stage.evaluate(e => [...e.options].map(x => x.textContent.trim())); out.stageOptions = o.slice(0, 8); await stage.selectOption({ label: o.find(x => /Qualification/i.test(x)) || o[1] }); } else { await stage.click(); await sleep(1000); await page.locator('[role=option]', { hasText: /Qualification/i }).first().click().catch(() => {}); } }
const amt = page.locator('xpath=//*[starts-with(normalize-space(),"Amount")]/ancestor::*[.//input][1]//input').first(); if (await amt.count()) await amt.fill('10000');
await sleep(2500); out.afterStageAmount = await state(); await shot('1823-3-filled.png');
return out;
