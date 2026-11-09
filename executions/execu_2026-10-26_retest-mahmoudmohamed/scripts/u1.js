// Explore the new rule editor: WHEN panel (read-only, nothing saved).
await go('/hq', 6000);
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
const fresh = page.getByRole('button', { name: 'Start fresh' }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
await shot('a0-editor');
await page.getByText('This rule will be executed', { exact: false }).first().click(); await sleep(2000); await shot('a1-when-panel');
const panel = await txt();
return done({ when: panel.split('\n').filter(l => l.trim()).slice(-60) });
