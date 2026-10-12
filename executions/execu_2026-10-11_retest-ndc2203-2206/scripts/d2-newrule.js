const off = capOn();
await go('/settings/automation/workflow-rules', 8000);
await page.getByRole('button', { name: 'New Rule' }).first().click(); await sleep(2500);
const dlg = await page.locator('[role=dialog]').first().innerText().catch(() => 'no dialog');
await shot('x-newrule-dialog');
off();
return done({ url: page.url(), dlg, cap });
