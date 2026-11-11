// Select All in the ticket list: read-only (select + clear, no bulk action)
const blocked=[]; await page.route('**/api/v1/**', r => { const m=r.request().method(); if (['PUT','PATCH','DELETE'].includes(m) || (m==='POST' && /bulk|mass|close|assign|merge/i.test(r.request().url()))) { blocked.push(m+' '+r.request().url().replace(/.*api\/v1/,'')); return r.abort(); } return r.continue(); });
await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/All Tickets \(\d+\)/.test(await text())) break; } await sleep(4000);
const total = ((await text()).match(/All Tickets \((\d+)\)/)||[])[1]; log('All Tickets count', total);
await shot('2823-list.png');
const cbs = await page.$$eval('[role=checkbox], input[type=checkbox]', cs => cs.map(c => ({a:c.getAttribute('aria-label')||'', t:(c.closest('label')||{}).innerText||'', x:Math.round(c.getBoundingClientRect().x), y:Math.round(c.getBoundingClientRect().y)})).slice(0,8)); log('checkboxes', cbs);
// tick first row to reveal the bulk bar
const rowCb = page.locator('[role=checkbox], input[type=checkbox]').nth(0); await rowCb.click(); await sleep(1500);
await shot('2823-one-selected.png');
const bar = await text(); log('bar after one', bar.split('\n').filter(l=>/selected|Select all|Select All|Clear selection/i.test(l)).slice(0,8));
const sa = page.locator('[aria-label*="elect all" i], button:has-text("Select all"), button:has-text("Select All")').first();
log('select-all control', await sa.count(), await sa.getAttribute('aria-label').catch(()=>null));
if (await sa.count()) { await sa.click(); await sleep(2500); const t2 = await text(); log('after select all', t2.split('\n').filter(l=>/selected|Select all|all \d+|Clear selection/i.test(l)).slice(0,8)); await shot('2823-select-all.png');
  const more = page.getByText(/Select all \d+|all \d+ tickets/i).first(); if (await more.count()) { log('extend option', await more.innerText()); await more.click(); await sleep(2500); log('after extend', (await text()).split('\n').filter(l=>/selected/i.test(l)).slice(0,5)); await shot('2823-select-all-view.png'); }
  const clr = page.getByText(/Clear selection/i).first(); if (await clr.count()) { await clr.click(); await sleep(1500); log('after clear', (await text()).split('\n').filter(l=>/selected/i.test(l)).slice(0,3)); } }
log('blocked writes', blocked);
