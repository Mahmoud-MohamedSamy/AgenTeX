await go('/settings/automation/workflow-rules', 3000);
for (let i = 0; i < 60; i++) { if ((await txt()).includes('Workflow Rules')) break; await sleep(1000); }
await page.getByRole('button', { name: 'Create in another module' }).click(); await sleep(1500);
const items = await page.locator('[role=menuitem],[role=option]').allInnerTexts();
return done({ items });
