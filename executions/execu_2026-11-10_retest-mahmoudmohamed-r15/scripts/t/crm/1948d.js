// usage: CODE env DECISION=Deny|Allow
const want = process.env.DECISION;
const reqs=[]; page.on('response', async r => { const u=r.url(); if (/visibility-policy/.test(u)) { let b=''; try{ b=(await r.text()).slice(0,300);}catch(e){} reqs.push(r.request().method()+' '+r.status()+' '+b); } });
await page.goto(H + '/settings/timeline/visibility', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/When no rule matches/i.test(await text())) break; } await sleep(2000);
await page.getByText(want, {exact:true}).first().click(); await sleep(800);
await page.getByRole('button', {name:'Save', exact:true}).click(); await sleep(4000);
await page.reload({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/When no rule matches/i.test(await text())) break; } await sleep(2000);
await shot('NDC-1948-policy-'+want+'.png');
log(reqs);
