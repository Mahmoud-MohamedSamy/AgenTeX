const out = {}; const clean = s => (s || '').replace(/\s+/g, ' ');
const btns = async () => (await page.$$eval('main button, main a[role=button]', b => b.map(x => (x.innerText || x.getAttribute('aria-label') || '').trim()).filter(Boolean))).slice(0, 60);
await go('/settings/automation/workflow-rules'); await sleep(9000); await shot('U10-agent-list');
out.list = { buttons: await btns(), text: clean(await page.locator('main').first().innerText().catch(() => '')).slice(0, 400) };
const row = page.locator('main tr', { hasText: 'QA WF CO86eq' }).first(); if (await row.count()) { await row.locator('button').last().click().catch(() => {}); await sleep(1200); out.rowMenu = await page.$$eval('[role=menuitem]', b => b.map(x => x.innerText.trim() + (x.getAttribute('aria-disabled') === 'true' || x.disabled ? ' (disabled)' : ''))); await shot('U10-agent-row-menu'); await page.keyboard.press('Escape'); }
await go('/settings/automation/workflow-rules/1c39d2eb-8ddd-4505-825d-f4b8eac02c19'); await sleep(8000); await shot('U10-agent-editor');
out.editor = { buttons: await btns(), readOnly: clean(await page.locator('main').first().innerText().catch(() => '')).match(/(read-only|view only|can't edit|cannot edit|permission)[^.]{0,120}/i)?.[0] };
await go('/settings/automation/actions'); await sleep(7000); await shot('U10-agent-actions'); out.actions = clean(await page.locator('main').first().innerText().catch(() => '')).slice(0, 300);
await go('/settings/workflow-executions'); await sleep(7000); await shot('U10-agent-exec'); out.exec = clean(await page.locator('main').first().innerText().catch(() => '')).slice(0, 200);
return out;
