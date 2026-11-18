const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.locator('[data-title="' + IMP + '"]').first().click({ force: true }); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/' + IMP + '-detail.png' });
const t = await body(page); const i = t.indexOf('IMPORT DETAIL VIEW'); out.detail = t.slice(i, i + 600);
out.clickables = await page.$$eval('a, button, [data-id]', es => es.filter(e => e.offsetParent && /fail|error|download|log|skip/i.test((e.innerText || '') + ' ' + (e.getAttribute('data-id') || '') + ' ' + (e.getAttribute('data-title') || ''))).map(e => (e.tagName + ' ' + (e.getAttribute('data-id') || '') + ' ' + (e.innerText || '').trim()).slice(0, 80))).catch(() => []);
const dl = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
const f = page.locator('[data-title="' + IMP + '"]').locator('xpath=ancestor::body').locator('text=/^1$/').last();
