// NDC-2230 / 2231 on the Desk record form (owner): serial hidden until Hardware, then required; qa_dep hidden + not required while ctrl ≠ x.
const st = {}; const M = '0a2f56b2-681d-41c1-b504-d2140eecb1e8';
await page.goto(H + '/modules/' + M, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 80; i++) { await sleep(3000); const t = await text(); if (/QA RT r10/.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(3000); await shot('2230-0-list.png'); st.listBtns = (await page.getByRole('button').allInnerTexts()).map(x => x.trim()).filter(x => /create|new|\+/i.test(x)); const cb = page.getByRole('button', { name: /^(Create|New|\+)/ }).first(); if (await cb.count()) await cb.click();
for (let i = 0; i < 80; i++) { await sleep(3000); const t = await text(); if (/QA kind|QA ctrl/.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(4000);
st.url = page.url(); await shot('2230-1-form-empty.png');
const vis = async l => page.getByText(l, { exact: true }).first().isVisible().catch(() => false);
st.empty = { serial: await vis('QA serial'), dep: await vis('QA dep') };
const pick = async (label, val) => { const box = page.getByText(label, { exact: true }).first().locator('xpath=ancestor::*[.//select or .//*[@role="combobox"] or .//button][1]'); const sel = box.locator('select'); if (await sel.count()) await sel.first().selectOption({ label: val }); else { await box.locator('[role=combobox], button').first().click(); await sleep(800); await page.getByRole('option', { name: val }).first().click().catch(() => page.getByText(val, { exact: true }).last().click()); } await sleep(1500); };
await page.locator('input').first().fill('QA RT r10 2230 form').catch(() => {});
await pick('QA kind', 'Hardware'); st.hardware = { serial: await vis('QA serial') }; await shot('2230-2-hardware.png');
await pick('QA ctrl', 'Z'); st.ctrlZ = { dep: await vis('QA dep') };
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(4000); await shot('2230-3-save-hw-no-serial.png');
const t = await text(); st.saveMsg = (t.match(/(This field is required|required|saved successfully|Record saved)[^\n]{0,60}/i) || [])[0]; st.stillOnForm = /\/new/.test(page.url());
await pick('QA ctrl', 'x'); st.ctrlx = { dep: await vis('QA dep') }; await shot('2230-4-ctrl-x.png');
return st;
