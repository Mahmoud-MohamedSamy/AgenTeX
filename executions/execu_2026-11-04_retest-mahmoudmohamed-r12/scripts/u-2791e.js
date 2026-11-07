const o = {};
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
const row = lbl => page.locator(`xpath=//*[normalize-space(text())="${lbl}"]/ancestor::*[self::div][2]`).first();
const lsel = page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::select[1]').first();
const look = async re => { const l = page.getByText(re).first(); if (!(await l.count())) return 'absent'; return (await l.locator('xpath=..').innerText()).replace(/\s+/g, ' ').slice(0, 50); };
for (const [dept, lay] of [['QA NDC Manual Invoice', 'QA NDC Manual Invoice'], ['QA NDC FLY-WT Refund', 'QA NDC FLY-WT Refund'], ['QA NDC Client Complaints', 'QA NDC Client Complaints']]) {
  await row('Department').locator('input, [role=combobox], button').first().click(); await sleep(1000); await page.keyboard.type(dept); await sleep(2500); await page.getByRole('option', { name: dept, exact: true }).first().click(); await sleep(4000);
  await lsel.selectOption({ label: lay }); await sleep(4000);
  o[lay] = { agentId: await look(/QA NDC Agent id/), tktNumber: await look(/QA NDC TKT number/) };
  if (lay === 'QA NDC Manual Invoice') await shot('2791-h-mi-form.png', { fullPage: true });
}
return o;
