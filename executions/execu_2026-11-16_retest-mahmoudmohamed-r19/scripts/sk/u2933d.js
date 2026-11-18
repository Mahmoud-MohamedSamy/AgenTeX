await page.goto(H+'/views/all/tickets/32050fd4-4c9a-4181-a28a-13135ed417f4',{waitUntil:'domcontentloaded'});
await page.getByText(/K31/).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const l=page.getByText(/^Skills$/).first();await l.scrollIntoViewIfNeeded();await sleep(800);
log(await l.evaluate(e=>{let p=e;for(let i=0;i<3;i++)p=p.parentElement;return p.outerHTML.slice(0,2500);}));
await shot('2933-x-ticket-info-skills.png');
const bb=await l.boundingBox();log(JSON.stringify(bb));
await page.mouse.move(bb.x+120,bb.y+30);await sleep(800);
const btns=await page.locator('button').evaluateAll((L,b)=>L.filter(e=>{const r=e.getBoundingClientRect();return Math.abs(r.y-b.y)<80&&r.x>200&&r.x<700;}).map(e=>(e.innerText||e.getAttribute('aria-label')||e.title||'').trim()),bb);log('btns '+JSON.stringify(btns));
