const out = {}; const off2 = respOn();
const pick = async (label, value) => {
  const lab = page.getByText(label, { exact: true }).first(); await lab.scrollIntoViewIfNeeded();
  const row = lab.locator('xpath=ancestor::*[.//button[normalize-space()="Select"] or .//button[@role="combobox"]][1]');
  await row.getByRole('button', { name: 'Select' }).first().click(); await sleep(800);
  await page.getByRole('option', { name: value, exact: false }).first().click(); await sleep(600);
};
await page.getByRole('textbox', { name: 'name@example.com' }).fill('qa.retest2205@qa.test');
const subj = page.getByRole('combobox', { name: 'Type or pick a subject' }); await subj.fill('QA retest NDC-2205 ' + Date.now()); await page.keyboard.press('Escape'); await sleep(400);
await page.getByRole('textbox', { name: 'Description' }).fill('original description');
await pick('Status', 'Open');
out.statusOpts = 'ok';
await pick('Priority', 'High');
await shot('NDC-2205-ticket-form');
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(7000);
out.url = page.url(); out.resp = capResp.filter(s => /records/.test(s)).map(s => s.slice(0, 300));
off2(); return done(out);
