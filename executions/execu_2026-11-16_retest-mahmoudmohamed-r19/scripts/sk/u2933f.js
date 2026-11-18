const id='32050fd4-4c9a-4181-a28a-13135ed417f4';
const reqs=[];page.on('request',r=>{if(/records\/|tickets\//.test(r.url())&&['PATCH','PUT','POST'].includes(r.method()))reqs.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,600));});
const resp=[];page.on('response',async r=>{if(['PATCH','PUT','POST'].includes(r.request().method())&&/records\/|tickets\//.test(r.url()))resp.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'domcontentloaded'});
await page.getByText(/QA RT19 SK/).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const b=page.getByRole('button',{name:'Edit Skills'});await b.waitFor({state:'attached',timeout:90000});await b.scrollIntoViewIfNeeded();await b.click();await sleep(2000);
for(const n of ['QA SK13 S1','QA RT19 SK Inact','QA SK12 Inact']){const c=page.locator('button[aria-pressed]',{hasText:new RegExp('^'+n+'$')}).first();log(n+' count '+await c.count());await c.scrollIntoViewIfNeeded();await c.click();await sleep(300);log(n+' pressed '+await c.getAttribute('aria-pressed'));}
const inact=page.locator('button[aria-pressed]',{hasText:/^QA RT19 SK Inact$/}).first();await inact.scrollIntoViewIfNeeded();await sleep(500);
await shot('2933-6-ticket-edit-skills-picked.png');
const btn=await page.locator('button').evaluateAll(L=>L.filter(e=>e.offsetParent&&/^(Save|Done|Apply|Update)$/i.test(e.innerText.trim())).map(e=>e.innerText.trim()));log('save buttons '+JSON.stringify(btn));
const sv=page.getByRole('button',{name:/^(Save|Done|Apply|Update)$/}).first();await sv.scrollIntoViewIfNeeded();await sv.click();await sleep(4000);
log('toast '+((await text()).match(/[^\n]*(saved|updated|dropped|removed|invalid|not)[^\n]*/gi)||[]).slice(0,5).join(' || '));
await page.reload({waitUntil:'domcontentloaded'});await page.getByText(/QA RT19 SK/).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const b2=page.getByRole('button',{name:'Edit Skills'});await b2.scrollIntoViewIfNeeded();log('after reload row: '+(await b2.innerText()).replace(/\n/g,' | '));await shot('2933-7-ticket-after-save.png');
log('reqs '+JSON.stringify(reqs));log('resp '+JSON.stringify(resp));
