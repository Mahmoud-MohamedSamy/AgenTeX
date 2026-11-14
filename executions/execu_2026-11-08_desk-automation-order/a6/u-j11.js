const posts = []; let drop = true;
await page.route(/blueprint-transitions\/verify$/, async r => { if (r.request().method() !== 'POST') return r.continue(); posts.push(JSON.parse(r.request().postData() || '{}').run_id); if (drop) { drop = false; await r.fetch().catch(() => {}); return r.abort('connectionreset'); } return r.continue(); });
await go('/views/all/tickets/e21c1bda-2a5e-470e-8bbf-26b407cb6c4e'); await sleep(7000);
await page.locator('[data-testid=desk-ticket-blueprint-buttons]').getByRole('button', { name: /QA verify/ }).click(); await sleep(2500);
log('prefilled', await page.locator('textarea').last().inputValue());
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(4000);
const b = (await text()).replace(/\s+/g, ' '); const m = b.match(/[^.]{0,80}(couldn't confirm|could not confirm|Retry)[^.]{0,120}/i); log('J11 msg', m && m[0]); await shot('j11-network-loss');
const retry = page.getByRole('button', { name: /retry/i }).first(); log('retry', await retry.count());
if (await retry.count()) { await retry.click(); await sleep(5000); }
log('after retry', ((await text()).match(/[^.]{0,60}(moved|Escalated)[^.]{0,80}/i) || [''])[0]); await shot('j11-after-retry');
log('run ids', posts);
