const out = {};
await openWQ(); await pick(/^Tasks, /);
out.tasksInitial = await state();
if (await page.getByRole('button', { name: 'Clear filters' }).count()) { await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(3000); }
await panel();
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
await page.getByPlaceholder('Search fields').fill('Priority'); await sleep(600); await opt().filter({ hasText: /^Priority$/ }).first().click(); await sleep(1200);
await page.locator('button[aria-label^="Operator for"]').first().click(); await sleep(700); await opt().filter({ hasText: /^Equals$/ }).click(); await sleep(800);
await page.locator('button[aria-label^="Value for"]').first().click(); await sleep(900); await opt().filter({ hasText: /^high$/ }).click(); await sleep(800); await page.keyboard.press('Escape'); await sleep(5000);
out.applied = await state(); await shot('NDC-1789-1-applied');
await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(6000);
out.afterRefresh = await state(); await shot('NDC-1789-2-after-refresh');
await page.getByRole('button', { name: 'Which open activities to count and list' }).click(); await sleep(900); await page.getByRole('option', { name: 'Overdue' }).click().catch(async () => page.getByText('Overdue', { exact: true }).last().click()); await sleep(5000);
out.afterPeriodOverdue = await state(); await shot('NDC-1789-5-period-overdue');
await page.getByRole('button', { name: 'Which open activities to count and list' }).click(); await sleep(900); await page.getByText('All open', { exact: true }).last().click(); await sleep(4000);
await pick(/^Calls, /); out.calls = await state(); await pick(/^Meetings, /); out.meetings = await state();
await pick(/^My Leads/); out.myLeads = await state(); await pick(/^EveryLeadWithNoAns/); out.everyLead = await state(); await shot('NDC-1789-6-scope-other-queue');
return done(out);
