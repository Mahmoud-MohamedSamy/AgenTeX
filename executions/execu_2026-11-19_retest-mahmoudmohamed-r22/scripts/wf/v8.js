const main=()=>page.locator('main').last();const R={blocked:[]};
await ctx.route(u=>true,r=>{const q=r.request();if(q.method()!=='GET'&&!/resolved-batch|heartbeat|negotiate|realtime/.test(q.url())){R.blocked.push(q.method()+' '+q.url().replace(H,'').slice(0,80));return r.abort();}return r.continue();});
await page.goto(H+'/settings/automation/workflow-rules/b3f7f4a3-def6-4cf3-8f33-53db39e40be7',{waitUntil:'domcontentloaded'});
await page.getByText('CONDITION').first().waitFor({timeout:90000}).catch(()=>{});await sleep(3000);
await page.getByRole('button',{name:/^EN/}).first().click();await sleep(4000);
R.pop=await page.evaluate(()=>[...document.querySelectorAll('[role=menu],[role=listbox],[data-radix-popper-content-wrapper]')].map(e=>e.outerHTML.slice(0,1200)));
await shot('3057-x-langmenu.png');
const ar=page.getByText('العربية');R.arc=await ar.count();
if(R.arc){await ar.click();await sleep(6000);R.dir=await page.evaluate(()=>document.documentElement.dir+' '+document.documentElement.lang);const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.search(/CONDITION|الشرط|شرط/);R.fold=t.slice(Math.max(0,i),i+900);await page.locator('main').last().getByText('1',{exact:true}).first().scrollIntoViewIfNeeded().catch(()=>{});await shot('3057-7-arabic-folded.png');}
return R;
