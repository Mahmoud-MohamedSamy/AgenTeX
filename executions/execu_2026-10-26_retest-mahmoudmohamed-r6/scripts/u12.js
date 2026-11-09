await page.getByText('Create a new Transactions for this Agency Code.', { exact: false }).first().click({ force: true }); await sleep(2500);
await shot('1823-02-deal-section');
const fields = await page.evaluate(() => { const out = []; document.querySelectorAll('label').forEach(l => { const t = l.innerText.trim(); if (!/probab|expected|amount|stage/i.test(t)) return; const box = l.closest('div'); const inp = box && box.parentElement && box.parentElement.querySelector('input, select, [role=combobox]'); out.push({ label: t, tag: inp?.tagName, ro: inp ? (inp.readOnly || inp.disabled || inp.getAttribute('aria-readonly') === 'true') : null, val: inp?.value }); }); return out; });
const inputs = await page.locator('input:visible').evaluateAll(a => a.map(x => ({ id: x.id, name: x.name, ph: x.placeholder, ro: x.readOnly || x.disabled, val: x.value, aria: x.getAttribute('aria-label') })).filter(o => /prob|expect|amount|revenue/i.test(JSON.stringify(o))));
return done({ fields, inputs });
