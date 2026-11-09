await page.getByText(/^history$/i).first().click({ force: true }); await sleep(3500); await shot('f4-history-tab');
const h = (await txt()).split('\n').filter(l => /QA WF|workflow|rule|System/i.test(l)).slice(0, 14);
await page.getByRole('button', { name: /^Actions/ }).first().click({ force: true }); await sleep(2000); await shot('b09-ticket-actions-menu');
const m = (await page.locator('[role=menu], [role=menuitem], [role=dialog]').allInnerTexts()).join(' | ').slice(0, 400);
await page.keyboard.press('Escape');
// deactivate the A5 send rule to show the Inactive tab filters
await api('POST', '/workflow/rules/f66b7716-314a-4c61-9427-42eade76e884/deactivate', {});
await go('/settings/automation/workflow-rules', 10000);
const tabs = await page.getByRole('tab').allInnerTexts();
await page.getByRole('tab', { name: /Inactive/ }).first().click(); await sleep(2500); await shot('f3-list-inactive');
const inact = (await txt()).split('\n').filter(l => /QA WF/.test(l));
return fin({ h, m, tabs, inact });
