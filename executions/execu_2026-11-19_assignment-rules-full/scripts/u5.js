const opts = async () => (await page.locator('[role=option]:visible').allInnerTexts().catch(() => [])).map(s => s.trim()).filter(Boolean);
await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' });
await page.getByText('Round Robin Rules').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.mouse.click(1380, 358); await sleep(1200); await page.getByRole('option', { name: 'QA AS6 Dept A', exact: true }).first().click().catch(() => {}); await sleep(3000);
await page.getByRole('button', { name: /New Rule/ }).first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last(); await dlg.getByPlaceholder(/./).first().fill('QA AR UI rr temp'); await dlg.getByRole('button', { name: /Add Target/ }).click(); await sleep(2000);
await shot('AR-UI-09-rr-target.png', { fullPage: true });
const t = await dlg.innerText(); const i = t.indexOf('Target 1'); log('rrTarget', t.slice(i, i + 1400).replace(/\s+/g, ' '));
await dlg.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(1500); const m = (await dlg.innerText()).match(/Choose a round robin type[^\n]*|Pick at least one agent[^\n]*/g); log('rrSaveEmpty', m);
await dlg.getByRole('button', { name: 'Cancel', exact: true }).click(); await sleep(1500);
await page.mouse.click(1531, 358); await sleep(1200); await page.mouse.click(1398, 400);
for (let k = 0; k < 20; k++) { await sleep(1500); if (!/Loading assignment settings/.test(await text())) break; }
const pd = page.locator('[role=dialog]').last();
const sw = pd.getByText('Agent level threshold', { exact: true }).locator('xpath=ancestor::div[.//button[@role="switch"]][1]').locator('button[role=switch]').first(); await sw.click(); await sleep(1500);
await page.mouse.click(720, 448); await sleep(1200); const o1 = await opts(); await page.getByRole('option', { name: 'Test User 1' }).first().click(); await sleep(800);
await pd.getByPlaceholder('Threshold').first().fill('0'); await pd.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(1500); const m2 = (await pd.innerText()).match(/[^\n]*1 to 200[^\n]*|[^\n]*whole number[^\n]*/i); log('threshold0', m2 && m2[0]); await shot('AR-UI-11-prefs-threshold0.png');
await pd.getByRole('button', { name: /Add agent/ }).click(); await sleep(1000); await pd.locator('button:has-text("Select an agent")').last().click(); await sleep(1200); const o2 = await opts(); await page.keyboard.press('Escape'); await sleep(500);
log('rowOptions first', o1.join(' | '), '|| second', o2.join(' | ')); await shot('AR-UI-12-prefs-rows.png');
await pd.getByRole('button', { name: 'Cancel', exact: true }).click(); await sleep(1500);
