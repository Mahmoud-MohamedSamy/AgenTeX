// NDC-1693: Settings › Modules and Fields › + Create New Module (UI), capture request/response.
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Create New Module/.test(await txt().catch(() => ''))) break; } await sleep(1500);
await page.getByRole('button', { name: /Create New Module/ }).first().click(); await sleep(1500);
const d = page.locator('[role=dialog]').last();
const txt0 = (await d.innerText()).slice(0, 700);
const ctrls = await d.locator('input, textarea, button, [role=combobox]').evaluateAll(es => es.map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || e.name || '') + ' | ' + (e.value || e.innerText || '').trim()).slice(0, 70)));
await shot('1693-01-dialog');
return done({ txt0, ctrls });
