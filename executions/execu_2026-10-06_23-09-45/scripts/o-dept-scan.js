await go('/settings', 7000); await page.getByText('Departments', { exact: true }).first().click(); await sleep(4000);
const btns = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
const s = await shot('dept-list');
const b = page.getByRole('button', { name: /(New|Add|Create).*Department|^New$|^Add$/ }).first(); let form = '';
if (await b.count()) { await b.click(); await sleep(2500); form = (await page.locator('[role=dialog]').last().innerText().catch(async () => (await txt()).slice(0, 800))).replace(/\s+/g, ' '); await shot('dept-new-form'); }
const ins = await page.locator('[role=dialog] input, [role=dialog] textarea, [role=dialog] select, main input, main textarea').evaluateAll(es => es.map(e => e.tagName + ':' + (e.type || '') + ':' + (e.placeholder || e.name || e.getAttribute('aria-label') || '')));
await page.keyboard.press('Escape');
rec('DEPT.scan', 'INFO', `buttons [${btns.join(' | ').slice(0, 300)}]; form "${form.slice(0, 600)}"; inputs ${ins.join(', ').slice(0, 400)}; url ${page.url().replace(H, '')}`);
return done();
