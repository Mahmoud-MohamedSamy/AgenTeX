// D-8: agent A (only owner of 'QA onlyA') suspended. Owner view of the ticket and the designer.
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/img-prep.json'), 'utf8'));
await go('/views/all/tickets/' + M.T.D8); await page.getByText('QA BP D8 owner ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
const b = page.getByRole('button', { name: 'QA onlyA' }).first(); log('step button shown', await b.count());
await shot('d8-ticket-owner-view');
if (await b.count()) { await b.click(); await sleep(3000); const run = page.getByRole('button', { name: 'Run' }).first(); if (await run.count()) { await run.click(); await sleep(4000); } log('after run', (await text()).replace(/\s+/g, ' ').match(/(not|owner|allowed|can't|cannot|Couldn)[^.]{0,160}/i)?.[0]); await shot('d8-owner-run-refused'); }
await go('/settings/automation/blueprints/' + M.B.D8); await sleep(9000);
await page.getByText('QA onlyA', { exact: true }).first().click().catch(() => {}); await sleep(2500);
log('designer', (await text()).replace(/\s+/g, ' ').match(/Who can run this.{0,200}/)?.[0]); log('warning words', /suspend|inactive|deactivat|no one can|warning/i.test(await text()));
await shot('d8-designer-no-warning');
return { ok: true };
