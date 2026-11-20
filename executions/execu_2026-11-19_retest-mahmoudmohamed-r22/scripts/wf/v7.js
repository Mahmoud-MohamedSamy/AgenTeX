const main=()=>page.locator('main').last();const R={};
await page.goto(H+'/settings/automation/workflow-rules/c4d6ea12-8765-45d0-9cfa-e276820c6b6e',{waitUntil:'domcontentloaded'});
await page.getByText('CONDITION').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);R.url=page.url().replace(H,'');
const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('CONDITION');R.fold=t.slice(i,i+900);
await page.getByText('CONDITION').first().scrollIntoViewIfNeeded().catch(()=>{});await shot('3057-5-crm-folded.png');
const sum=main().locator('button',{hasText:'Lead Source'}).first();if(await sum.count()){await sum.dispatchEvent('click');await sleep(2500);const lg=main().getByText('Lead Source',{exact:true}).last();await lg.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);await shot('3057-6-crm-editor.png');const t2=(await main().innerText()).replace(/\s+/g,' ');const k=t2.indexOf('Which');R.ed=t2.slice(k,k+700);}
return R;
