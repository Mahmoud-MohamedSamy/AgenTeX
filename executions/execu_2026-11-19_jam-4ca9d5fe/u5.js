await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' });
await page.getByText('Round Robin Rules').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.getByRole('combobox').filter({ hasText: /Customer Support|QA|Department/ }).first().click().catch(async () => { await page.mouse.click(1380, 358); }); await sleep(1500);
await page.getByRole('option', { name: 'QA AO Dept B', exact: true }).first().click().catch(async () => { await page.getByText('QA AO Dept B', { exact: true }).first().click(); }); await sleep(4000);
log('dept', (await page.locator('[role=combobox]').allInnerTexts()).join(' | '));
await page.mouse.click(1531, 358); await sleep(1500); await shot('JAMR-2-menu.png');
await page.mouse.click(1398, 400); for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Loading assignment settings/.test(await text())) break; }
await shot('JAMR-3-prefs.png', { fullPage: true });
const row = page.getByText('Agent level threshold', { exact: true }).first(); const sw = row.locator('xpath=ancestor::div[.//button[@role="switch"]][1]').locator('button[role=switch]').first();
log('agentSwitch', await sw.getAttribute('aria-checked').catch(() => '?')); await sw.click().catch(async () => { await page.mouse.click(1093, 372); }); await sleep(2000);
await shot('JAMR-6-agent-level.png'); const t = await text(); const i = t.indexOf('Agent level threshold'); log(t.slice(i, i + 600).replace(/\s+/g, ' '));
await page.mouse.click(720, 448); await sleep(1500);
const opts = (await page.getByRole('option').allInnerTexts().catch(() => [])).map(x => x.trim()); log('options', opts.slice(0, 12));
const o1 = page.getByRole('option', { name: /Test User 1/ }).first(); if (await o1.count()) await o1.click(); else { await page.keyboard.type('Test User 1'); await sleep(1200); await page.keyboard.press('Enter'); } await sleep(1000);
await page.getByPlaceholder('Threshold').first().fill('5'); await sleep(800);
await shot('JAMR-7-agent-row.png');
await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(5000); await shot('JAMR-8-saved.png');
log('after', (await text()).includes('Round Robin Preferences') ? 'dialog still open' : 'dialog closed');
