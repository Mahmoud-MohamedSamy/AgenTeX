const R={nf:[]};page.on('response',r=>{if(r.status()===404)R.nf.push(r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').replace(/[?].*/,''));});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/automation/workflow-rules/1a704422-e849-4321-94ea-51177b6d1850',{waitUntil:'commit'});await page.getByText('3105 part').first().waitFor({timeout:120000});await sleep(7000);
R.toast=await page.getByText('The requested resource was not found.').count();await shot('3134-r1-a-open.png',{timeout:90000});
await page.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/Contact Name/.test(n.textContent)){n.parentElement.scrollIntoView({block:'center'});break;}}});await sleep(1500);
const t=await bt();const k=t.indexOf('Contact Name');R.contact=t.slice(k,k+160);await shot('3134-r1-b-contact.png',{timeout:90000});
R.nf=[...new Set(R.nf)];return R;
