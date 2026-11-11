const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
const reqs=[]; const t0=Date.now(); page.on('request', r => { const u=r.url(); if (/mass-update|bulk|jobs/.test(u)) reqs.push('REQ +'+(Date.now()-t0)+'ms '+r.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' ids='+(((r.postData()||'').match(/[0-9a-f]{8}-[0-9a-f-]{27}/g)||[]).length)); });
page.on('response', r => { const u=r.url(); if (/mass-update|bulk|jobs/.test(u)) reqs.push('RES +'+(Date.now()-t0)+'ms '+r.status()+' '+u.replace(/^https:\/\/[^/]+/,'')); });
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; }
await sleep(2000);
await page.locator('select').filter({ has: page.locator('option', {hasText:'200'}) }).selectOption('200'); await sleep(6000);
log('rows', (await page.$$('tbody tr')).length);
await page.locator('thead input[type=checkbox]').first().check(); await sleep(1500);
log('chip', ((await text()).match(/\d+ selected/)||[''])[0]);
await page.getByRole('button', {name:'Module actions'}).click(); await sleep(1200);
await page.getByRole('menuitem', {name:'Mass Update'}).click(); await sleep(3000);
const d = page.locator('[role=dialog]').last(); log((await d.innerText()).split('\n')[2]);
await d.getByText('Choose a field').click(); await sleep(1200);
const opt = page.getByRole('option', {name:'Lead Source', exact:true}); if (await opt.count()) await opt.first().click(); else await page.getByText('Lead Source', {exact:true}).last().click();
await sleep(1500);
await shot('NDC-2807-mu-field.png');
const vsel = d.locator('select').last(); if (await vsel.count()) { log('value opts', await vsel.evaluate(s=>[...s.options].map(o=>o.text).join('|'))); await vsel.selectOption({label:'web'}); }
else { await d.getByText(/Select|Choose a value/).last().click(); await sleep(800); await page.getByRole('option', {name:'web'}).first().click(); }
await sleep(800); await shot('NDC-2807-mu-ready.png');
await d.getByRole('button', {name:'Update records'}).click();
await sleep(300);
const atClick = await text(); log('after click', (atClick.match(/(Updating[^\n]*|\d+ of \d+[^\n]*|keep using[^\n]*)/i)||[''])[0]);
await shot('NDC-2807-mu-running.png');
// leave the page mid-run
await page.getByRole('link', {name:'Home'}).first().click(); log('left at +'+(Date.now()-t0)+'ms'); await sleep(20000);
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; } await sleep(3000);
await shot('NDC-2807-mu-back.png');
const back = await text(); log('back banner', (back.match(/(Updating[^\n]*|\d+ of \d+ [^\n]*done[^\n]*|updated[^\n]*)/i)||[''])[0]);
log(reqs);
