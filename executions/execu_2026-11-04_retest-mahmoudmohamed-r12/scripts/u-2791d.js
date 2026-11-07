const o = {}; const bb = async (loc) => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
const row = lbl => page.locator(`xpath=//*[normalize-space(text())="${lbl}"]/ancestor::*[self::div][2]`).first();
const lsel = page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::select[1]').first();
const acct = async () => { const l = page.getByText(/QA NDC 4-Account Number/).first(); if (!(await l.count())) return 'absent'; await l.scrollIntoViewIfNeeded(); await sleep(500); const t = await l.locator('xpath=..').innerText().catch(() => ''); return { label: t.replace(/\s+/g, ' ').slice(0, 60), box: await bb(l.locator('xpath=ancestor::*[self::div][2]')) }; };
// Finance TKT (default in Customer Support)
await lsel.selectOption({ label: 'QA NDC NDC Finance TKT' }); await sleep(4000); o.financeTKT = await acct(); await shot('2791-f-financeTKT-form.png');
// FLY-WT Refund
await row('Department').locator('input, [role=combobox], button').first().click(); await sleep(1000); await page.keyboard.type('QA NDC FLY-WT Refund'); await sleep(2500); await page.getByRole('option', { name: 'QA NDC FLY-WT Refund', exact: true }).first().click(); await sleep(4000);
await lsel.selectOption({ label: 'QA NDC FLY-WT Refund' }); await sleep(4000); o.fly = await acct();
await row('Subject').locator('input').first().fill('QA RT12 2791 fly ui no account'); await page.keyboard.press('Escape');
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000);
o.flyErr = (await text()).match(/[^\n]*(required|4-Account)[^\n]*/gi)?.slice(0, 5); await shot('2791-g-fly-save.png'); o.url = page.url();
return o;
