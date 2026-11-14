// Fill Z11/Z12 on 'QA BP ZM missing' and save as draft, to learn the stored keys.
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/zm-prep.json'), 'utf8'));
const resp = []; page.on('response', async r => { if (/blueprints/.test(r.url()) && r.request().method() !== 'GET') resp.push(r.request().method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 150)); });
await go('/settings/automation/blueprints/' + M.B); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'Open' }).first().click(); await sleep(2000);
await page.locator('select').filter({ has: page.locator('option', { hasText: 'QA AS6 BH' }) }).first().selectOption({ label: 'QA AS6 BH' }); await sleep(800);
const addEsc = page.getByRole('button', { name: 'Add escalation level' });
await addEsc.click(); await sleep(1200); await addEsc.click(); await sleep(1200);
const whens = page.locator('select').filter({ has: page.locator('option', { hasText: 'At the limit' }) });
await whens.nth(1).selectOption({ label: 'After the limit' }); await sleep(800);
const agents = page.locator('select').filter({ has: page.locator('option', { hasText: 'ndc-staging-owner' }) });
await agents.nth(0).selectOption({ label: 'ndc-staging-owner' }); await sleep(800);
await agents.nth(1).selectOption({ label: 'ndc-staging-owner' }).catch(() => {}); await sleep(800);
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('Escalation levels'); log('esc filled', t.slice(i, i + 900));
log('inputs near levels', await page.locator('input').evaluateAll(a => a.filter(x => x.offsetParent && x.getBoundingClientRect().x > 1240).map(x => (x.type) + ':' + (x.placeholder || x.getAttribute('aria-label') || '') + '=' + x.value)));
await page.getByText(/Level 1/).first().scrollIntoViewIfNeeded(); await sleep(600); await shot('zm-esc-filled');
await page.getByRole('button', { name: 'Save state' }).click(); await sleep(1500);
await page.getByRole('button', { name: 'Save Draft' }).click(); await sleep(5000);
return { ok: true, resp };
