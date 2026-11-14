const posts = []; let n = 0;
await page.route(/blueprint-transitions\/verify$/, async r => { if (r.request().method() !== 'POST') return r.continue(); n++; posts.push(JSON.parse(r.request().postData() || '{}').run_id);
  const res = await r.fetch(); const body = await res.text(); posts.push(res.status() + ' ' + body.slice(0, 120));
  if (n === 1) return r.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ success: false, error: { code: 'BLUEPRINT_RUN_INCOMPLETE', message: 'The ticket moved, but some items were not saved.', details: { run_id: posts[0], errors: [{ path: 'comment', message: 'QA simulated: the internal comment was not saved.' }] } } }) });
  return r.fulfill({ response: res, body }); });
await go('/views/all/tickets/889df39a-72cc-4264-8e03-244da36bd168'); await sleep(7000);
await page.locator('[data-testid=desk-ticket-blueprint-buttons]').getByRole('button', { name: /QA verify/ }).click(); await sleep(2500);
await page.locator('textarea').last().fill('QA J10 description');
await page.locator('[contenteditable=true]').last().click(); await page.keyboard.type('QA J10 note'); await sleep(500);
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(4000);
const b = (await text()).replace(/\s+/g, ' '); log('J10 msg', (b.match(/[^.]{0,40}The ticket moved[^]{0,220}/) || [''])[0]); await shot('j10-incomplete');
const retry = page.getByRole('button', { name: /retry/i }).first(); log('retry', await retry.count());
if (await retry.count()) { await retry.click(); await sleep(5000); }
await shot('j10-after-retry'); log('posts', posts);
