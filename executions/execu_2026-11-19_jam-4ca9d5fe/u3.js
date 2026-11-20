await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' });
await page.getByText('Round Robin Rules').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.getByRole('combobox').filter({ hasText: /Customer Support|QA|Department/ }).first().click().catch(async () => { await page.mouse.click(1380, 358); }); await sleep(1500);
await page.getByRole('option', { name: 'QA AO Dept B', exact: true }).first().click().catch(async () => { await page.getByText('QA AO Dept B', { exact: true }).first().click(); }); await sleep(4000);
log('dept', (await page.locator('[role=combobox]').allInnerTexts()).join(' | '));
await page.mouse.click(1531, 358); await sleep(1500); await shot('JAMR-2-menu.png');
await page.mouse.click(1398, 400); for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Loading assignment settings/.test(await text())) break; }
await shot('JAMR-3-prefs.png', { fullPage: true });
const inp = page.locator('input[type=number]:visible').first(); await inp.click({ clickCount: 3 }); await inp.fill('5'); await sleep(800);
const row = page.getByText('Assign tickets on closure', { exact: true }).first(); const sw = row.locator('xpath=ancestor::div[.//button[@role="switch"]][1]').locator('button[role=switch]').first();
const before = await sw.getAttribute('aria-checked').catch(() => null); if (before !== 'true') { await sw.click().catch(async () => { await page.mouse.click(1093, 535); }); } await sleep(800);
log('closureSwitch', before, '->', await sw.getAttribute('aria-checked').catch(() => 'n/a'));
await shot('JAMR-4-prefs-set.png');
await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(5000);
await shot('JAMR-5-after-save.png');
