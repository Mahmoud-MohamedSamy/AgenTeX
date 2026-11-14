// Z11/Z12 now in the designer: fill the business-hours set + an escalation level, save draft, read back. Then screen the customer triggers.
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/zm-prep.json'), 'utf8'));
const resp = []; page.on('response', async r => { if (/blueprints/.test(r.url()) && r.request().method() !== 'GET') resp.push(r.request().method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); });
await go('/settings/automation/blueprints/' + M.B); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'Open' }).first().click(); await sleep(2000);
const bh = page.locator('select').filter({ has: page.locator('option', { hasText: 'QA AS6 BH' }) }).first();
log('bh options', await bh.evaluate(s => [...s.options].map(o => o.value.slice(0, 12) + '=' + o.text)));
await bh.selectOption({ label: 'Default' }); await sleep(800);
const addEsc = page.getByRole('button', { name: 'Add escalation level' }); await addEsc.scrollIntoViewIfNeeded(); await addEsc.click(); await sleep(1500);
await addEsc.click(); await sleep(1500);
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('Escalation levels'); log('esc ui', t.slice(i, i + 1200));
log('esc controls', await page.locator('select,input,textarea').evaluateAll(a => a.filter(x => x.offsetParent && x.getBoundingClientRect().x > 1240).map(x => x.tagName + '#' + (x.getAttribute('aria-label') || x.placeholder || x.name || '') + '=' + (x.value || '').slice(0, 30) + (x.options ? ' [' + [...x.options].map(o => o.text).slice(0, 10).join('/') + ']' : ''))));
const lv = page.getByText(/Level 1/).first(); if (await lv.count()) await lv.scrollIntoViewIfNeeded(); await sleep(600);
await shot('zm-esc-levels');
const ct = page.getByText('Customer triggers').first(); await ct.scrollIntoViewIfNeeded(); await sleep(800);
const t2 = (await text()).replace(/\s+/g, ' '); const j = t2.indexOf('Customer triggers'); log('triggers', t2.slice(j, j + 500));
await shot('zm-customer-triggers');
return { ok: true, resp };
