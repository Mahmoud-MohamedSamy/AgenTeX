const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const resp = [];
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(900);
const menu = await page.locator('[role=menu]').allInnerTexts();
await page.getByText(/Layout Permission/).first().click(); await sleep(2000);
const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(1500);
if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(1500); }
const pick = (await txt()).match(/Select principals for[\s\S]{0,900}/)?.[0];
await page.mouse.click(189, 175); await sleep(1000);
const opts = await page.locator('[role=option],[role=menuitem],[role=listbox] li').allInnerTexts();
await page.getByText('Profiles', { exact: true }).last().click(); await sleep(2000);
const prof = (await txt()).match(/AVAILABLE[\s\S]{0,500}/)?.[0];
await shot('2229-04-picker-profiles');
await page.mouse.click(189, 175); await sleep(800); await page.getByText(/Org units|Org Units|Departments/).last().click().catch(() => {}); await sleep(2000);
const ou = (await txt()).match(/AVAILABLE[\s\S]{0,400}/)?.[0];
await shot('2229-05-picker-orgunits');
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {});
return done({ opts, prof, ou });
