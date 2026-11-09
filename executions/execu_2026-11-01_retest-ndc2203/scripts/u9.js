page.on('dialog', d => d.accept().catch(() => {}));
await api('GET', '/desk/departments');
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
const fresh = page.getByRole('button', { name: 'Start fresh' }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
await page.getByText('Tickets matching certain conditions', { exact: true }).click({ force: true }); await sleep(1500);
await shot('e0-condition-open');
const btns = await page.locator('button,[role=combobox]').evaluateAll(b => b.map(x => x.innerText.trim()).filter(t => t && t.length < 40));
return fin({ btns: btns.slice(-30) });
