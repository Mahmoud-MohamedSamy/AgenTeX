// NDC-2384: Create New Module dialog (Settings › Modules and Fields).
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/modules-and-fields', 15000); await shot('2384-01-list');
await page.getByRole('button', { name: /Create (New )?Module/i }).first().click(); await sleep(2000); await shot('2384-02-dialog');
const d = page.locator('[role=dialog]').last(); const before = await d.innerText();
const inputs = await d.locator('input, textarea').evaluateAll(a => a.map(x => (x.getAttribute('placeholder') || x.name || x.id || x.type)));
return done({ dialog: before.split('\n').filter(l => l.trim()).slice(0, 30), inputs });
