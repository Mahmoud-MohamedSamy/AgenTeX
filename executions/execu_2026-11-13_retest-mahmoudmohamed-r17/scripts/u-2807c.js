const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='705a2841-a7dc-4acf-bf72-911f99b94f60';
const t0=Date.now(); const reqs=[]; page.on('request', r => { if (/records\/mass-update/.test(r.url())) reqs.push('+'+(Date.now()-t0)); });
const rx=/(already running[^\n]*|in progress[^\n]*|\d+ of \d+ done[^\n]*|Apply the same values[^\n]*|Mass update ·[^\n]*)/ig;
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; }
await sleep(2000);
await page.locator('select').filter({ has: page.locator('option', {hasText:'200'}) }).selectOption('200'); await sleep(6000);
await page.locator('thead input[type=checkbox]').first().click(); await sleep(2500);
const openMU=async(val)=>{ await page.getByRole('button', {name:'Module actions'}).click(); await sleep(1200);
  await page.getByRole('menuitem', {name:'Mass Update'}).click(); await sleep(3000);
  const d = page.locator('[role=dialog]').last(); log('dialog head', (await d.innerText()).split('\n').slice(0,4).join(' | '));
  if(!val) return d;
  await d.getByText('Choose a field').click(); await sleep(1200);
  const opt = page.getByRole('option', {name:'Lead Source', exact:true}); if (await opt.count()) await opt.first().click(); else await page.getByText('Lead Source', {exact:true}).last().click();
  await sleep(1500); await d.getByText('Lead Source', {exact:true}).last().locator('xpath=following::*[1]').click(); await sleep(1200);
  const ro = page.getByRole('option', {name:new RegExp('^'+val+'$','i')}); if (await ro.count()) await ro.first().click(); else await page.getByText(new RegExp('^'+val+'$','i')).last().click();
  await sleep(800); await page.keyboard.press('Escape').catch(()=>{}); await sleep(300); return d; };
let d=await openMU('Web'); await shot('2807-7-ready.png');
const wr = page.waitForRequest(r => /records\/mass-update/.test(r.url()), { timeout: 60000 });
await d.getByRole('button', {name:/Update records/}).click({ noWaitAfter: true }); await wr; log('sent +'+(Date.now()-t0));
await sleep(800); await page.keyboard.press('Escape'); await sleep(800); await shot('2807-8-running.png'); log('running', ((await text()).match(rx)||[]).slice(0,4));
// second start on the same selection
log('still selected', ((await text()).match(/\d+ selected/)||[''])[0]);
d=await openMU(null); await shot('2807-9-second-open.png'); log('second dialog', ((await text()).match(rx)||[]).slice(0,5));
const ub=d.getByRole('button', {name:/Update records/}); log('update btn enabled', await ub.isEnabled().catch(()=>'n/a'));
await page.keyboard.press('Escape'); await sleep(45000); log('requests', reqs.length);
