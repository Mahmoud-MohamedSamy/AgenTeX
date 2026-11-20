const main=()=>page.locator('main').last();const R={};
await page.goto(H+'/settings/automation/workflow-rules/b3f7f4a3-def6-4cf3-8f33-53db39e40be7',{waitUntil:'domcontentloaded'});
await page.getByText('CONDITION').first().waitFor({timeout:60000}).catch(()=>{});await sleep(5000);
const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('CONDITION');R.lists=t.slice(i,i+1600);
await page.getByText('CONDITION').first().scrollIntoViewIfNeeded();await shot('3057-1-lists-folded.png');
return R;
