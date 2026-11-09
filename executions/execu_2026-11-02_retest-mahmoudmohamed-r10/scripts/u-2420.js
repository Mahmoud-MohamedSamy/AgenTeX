const id='d8746d4e-923b-45a7-abbb-e826e9e0cf40'; const reqs=[];
page.on('response', r=>{ const u=r.url(); if(/portal/i.test(u)&&/api\/v1/.test(u)) reqs.push(r.status()+' '+u.replace(/^.*api\/v1/,'')); });
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000});
for(let i=0;i<40;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 2420') && !/Loading\.\.\./.test(t)) break; }
await sleep(4000); await shot('2420-lead-top.png');
const t=await text(); log('portal', (t.match(/(Customer )?Portal.{0,300}/s)||['-'])[0].replace(/\s+/g,' '));
const p=page.locator('text=/Portal/').first(); if(await p.count()){ await p.scrollIntoViewIfNeeded(); await sleep(2500); await shot('2420-lead-portal.png'); }
log('reqs', reqs); return t.slice(0,400).replace(/\s+/g,' ');
