const id=process.env.TID;const tag=process.env.TAG;
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});
await page.getByText(/QA RT(19|20)/).first().waitFor({timeout:120000}).catch(()=>{});await sleep(6000);
const b=page.getByRole('button',{name:'Edit Skills'});await b.waitFor({state:'attached',timeout:120000});await b.scrollIntoViewIfNeeded();await sleep(500);log('row: '+(await b.innerText()).replace(/\n/g,' | '));
await b.click();await sleep(3000);
const opts=await page.locator('button[aria-pressed]').evaluateAll(L=>L.filter(e=>e.offsetParent).map(e=>e.innerText.trim().slice(0,45)+(e.getAttribute('aria-pressed')==='true'?' [ON]':'')));
log('opts('+opts.length+') '+JSON.stringify(opts));
const bb=await page.locator('button[aria-pressed]').first().evaluate(e=>{let p=e;for(let i=0;i<6&&p.parentElement;i++)p=p.parentElement;const r=p.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round);}).catch(()=>null);log('panel '+JSON.stringify(bb));
await shot(tag+'.png');
if(process.env.SAVE){
 for(const n of process.env.SAVE.split('|')){const c=page.locator('button[aria-pressed]',{hasText:new RegExp('^'+n+'$')}).first();await c.scrollIntoViewIfNeeded();await c.click();await sleep(400);log(n+' pressed='+await c.getAttribute('aria-pressed',{timeout:3000}).catch(()=>'(gone from list)'));}
 await shot(tag+'-picked.png');
 const sv=page.getByRole('button',{name:/^(Save|Done|Apply|Update)$/}).first();await sv.scrollIntoViewIfNeeded();await sv.click();await sleep(4000);
 log('toast '+((await text()).match(/[^\n]*(saved|updated|invalid|error)[^\n]*/gi)||[]).slice(0,3).join(' || '));
 await page.reload({waitUntil:'commit'});await page.getByText(/QA RT(19|20)/).first().waitFor({timeout:120000}).catch(()=>{});await sleep(6000);
 const b2=page.getByRole('button',{name:'Edit Skills'});await b2.scrollIntoViewIfNeeded();log('after reload row: '+(await b2.innerText()).replace(/\n/g,' | '));await shot(tag+'-after.png');
}
