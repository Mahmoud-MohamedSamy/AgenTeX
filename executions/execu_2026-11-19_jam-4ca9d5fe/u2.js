await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' });
await page.getByText('Round Robin Rules').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.getByRole('combobox').filter({ hasText: /Customer Support|QA|Department/ }).first().click().catch(async () => { await page.mouse.click(1380, 358); }); await sleep(1500);
await page.getByRole('option', { name: 'QA AO Dept B', exact: true }).first().click().catch(async () => { await page.getByText('QA AO Dept B', { exact: true }).first().click(); }); await sleep(4000);
log('dept', (await page.locator('[role=combobox]').allInnerTexts()).join(' | '));
await page.mouse.click(1531, 358); await sleep(1500); await shot('JAMR-2-menu.png');
await page.mouse.click(1398, 400); for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Loading assignment settings/.test(await text())) break; }
await shot('JAMR-3-prefs.png', { fullPage: true });
const t = await text(); const i = t.search(/Preferences/); log(t.slice(i, i + 1500).replace(/\s+/g, ' '));
