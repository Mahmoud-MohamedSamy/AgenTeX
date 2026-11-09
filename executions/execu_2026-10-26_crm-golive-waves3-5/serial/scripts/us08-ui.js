await page.goto('https://staging-crm.taviportal.com/settings/general/users', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
const row = page.locator('tr', { hasText: 'ndc-staging-owner@taviportal.com' }).first();
await row.click().catch(() => {}); await page.waitForTimeout(3000);
const dlg = page.locator('[role=dialog]').first(); const shown = await dlg.isVisible().catch(() => false);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/serial/evidence/raw/t-us08-owner-dialog.png' });
const text = shown ? (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 900) : (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 600);
const selects = shown ? await dlg.locator('select, [role=combobox], input').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.name || e.id || e.tagName) + ':' + (e.disabled || e.getAttribute('aria-disabled') === 'true' ? 'disabled' : 'enabled'))) : [];
await page.keyboard.press('Escape').catch(() => {});
return { dialog: shown, text, controls: selects };
