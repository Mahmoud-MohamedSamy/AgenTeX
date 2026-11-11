const blocked=[]; await page.route('**/api/v1/**', r => { const m=r.request().method(); if (['PUT','PATCH','DELETE'].includes(m) || (m==='POST' && /bulk|mass|close|assign|merge/i.test(r.request().url()))) { blocked.push(m+' '+r.request().url()); return r.abort(); } return r.continue(); });
const reqs=[]; page.on('request', r=>{ if(/records\?/.test(r.url())) reqs.push(r.url().replace(/.*records\?/,'').slice(0,80)); });
await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/All Tickets \(\d+\)/.test(await text())) break; } await sleep(4000);
const state = async () => ({bar:(await text()).split('\n').find(l=>/selected/i.test(l))||'(no bar)', master: await page.locator('[aria-label="Select all"]').first().getAttribute('aria-checked').catch(()=>'?'), rows: await page.$$eval('[role=checkbox][aria-label^="Select "]:not([aria-label="Select all"])', cs => cs.length+' rendered, '+cs.filter(c=>c.getAttribute('aria-checked')==='true').length+' checked')});
await page.locator('[aria-label="Select all"]').first().click(); await sleep(1500); log('A after select all', await state());
// scroll the ticket list container a little
const box = await page.locator('[aria-label^="Select QA"]').first().boundingBox(); await page.mouse.move(box.x+100, box.y+100);
await page.mouse.wheel(0, 700); await sleep(2500); log('B small scroll', await state()); await shot('2823-small-scroll.png');
await page.mouse.wheel(0, 6000); await sleep(4000); log('C big scroll (loads more)', await state()); await shot('2823-big-scroll.png');
log('record requests', reqs); log('blocked', blocked);
