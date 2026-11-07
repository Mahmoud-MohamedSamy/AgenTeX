const o = {};
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
const row = lbl => page.locator(`xpath=//*[normalize-space(text())="${lbl}"]/ancestor::*[self::div][2]`).first();
const layoutBtn = page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::*[self::button or self::select or @role="combobox"][1]').first();
const readLayouts = async (tag) => {
  o[tag + '_selected'] = (await layoutBtn.innerText().catch(() => '')).trim() || await layoutBtn.inputValue().catch(() => '');
  await layoutBtn.click(); await sleep(1500);
  o[tag + '_options'] = (await page.getByRole('option').allInnerTexts()).map(s => s.trim()).filter(Boolean);
  if (!o[tag + '_options'].length) o[tag + '_options'] = (await page.locator('[role=menuitem],[role=menuitemradio],[cmdk-item]').allInnerTexts()).map(s => s.trim());
  await shot(`2801-${tag}.png`); await page.keyboard.press('Escape'); await sleep(800);
};
const pickDept = async name => { await row('Department').locator('input, [role=combobox], button').first().click(); await sleep(1000); await page.keyboard.type(name); await sleep(2500); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(4000); };
await readLayouts('a-customer-support');
await pickDept('QA NDC Accounting'); await readLayouts('b-accounting');
o.b_fields = (await text()).match(/IATA Source|ADM Number|Airline Code/g);
await pickDept('HR'); await readLayouts('c-hr');
return o;
