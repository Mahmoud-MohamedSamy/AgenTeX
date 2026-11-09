// NDC-2547: Settings › Security Control › Permissions — the create button and what it opens.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings', 10000); await page.getByText('Permissions', { exact: true }).first().click({ force: true }); await sleep(6000);
await shot('2547-01-permissions');
const btns = await page.locator('button:visible').evaluateAll(b => b.map(x => x.innerText.trim()).filter(t => /create|new|add/i.test(t)));
const b = page.getByRole('button', { name: /^(Create|New|Add)/i }).filter({ hasNotText: /^New$/ }).first(); const label = await b.innerText().catch(() => '');
await b.click().catch(() => {}); await sleep(2000); await shot('2547-02-dialog');
const title = await page.locator('[role=dialog]').last().innerText().catch(() => 'no dialog');
await page.keyboard.press('Escape');
return done({ url: page.url(), btns, clicked: label, dialog: title.split('\n').slice(0, 6) });
