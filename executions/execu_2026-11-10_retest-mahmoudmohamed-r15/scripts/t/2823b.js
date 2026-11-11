const blocked=[]; await page.route('**/api/v1/**', r => { const m=r.request().method(); if (['PUT','PATCH','DELETE'].includes(m) || (m==='POST' && /bulk|mass|close|assign|merge/i.test(r.request().url()))) { blocked.push(m+' '+r.request().url().replace(/.*api\/v1/,'')); return r.abort(); } return r.continue(); });
await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/All Tickets \(\d+\)/.test(await text())) break; } await sleep(4000);
const sel = () => text().then(t => (t.split('\n').find(l=>/selected/i.test(l))||'').trim());
await page.locator('[aria-label="Select all"]').first().click(); await sleep(1500);
log('1 after Select all', await sel());
const bulk = await page.$$eval('button', bs => bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(x=>/^(Assign To|Update|Reply|Comment|Close|Merge|More|Clear selection|Select all \d+.*)$/i.test(x)));
log('bulk actions', bulk);
await shot('2823-select-all.png');
// scroll the list to load more rows
const list = page.locator('[aria-label^="Select QA"], [aria-label^="Select "]').last();
for (let i=0;i<4;i++){ await list.scrollIntoViewIfNeeded().catch(()=>{}); await page.mouse.wheel(0, 4000); await sleep(2500); }
log('2 after scrolling', await sel());
const rows = await page.$$eval('[role=checkbox][aria-label^="Select "], input[type=checkbox][aria-label^="Select "]', cs => ({n:cs.length, checked: cs.filter(c=>c.getAttribute('aria-checked')==='true'||c.checked).length}));
log('rows loaded/checked', rows);
await shot('2823-after-scroll.png');
// unselect one row then clear
await page.locator('[aria-label="Select all"]').first().click(); await sleep(1500); log('3 after Select all again (toggle)', await sel());
log('blocked writes', blocked);
