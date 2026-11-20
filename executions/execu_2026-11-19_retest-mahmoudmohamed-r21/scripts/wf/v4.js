const main=()=>page.locator('main').last();const R={};
for(const [k,id] of [['lists','b3f7f4a3-def6-4cf3-8f33-53db39e40be7'],['related','9f6fde07-08f1-4491-81c1-c68c23c4eacf'],['appr','12976e14-68f1-4e16-b805-d29ab99dd233']]){
await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'domcontentloaded'});await sleep(10000);
const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('CONDITION');R[k]=t.slice(i,i+700);
const c=main().getByText(/^1$/).first();await page.locator('text=CONDITION').first().scrollIntoViewIfNeeded().catch(()=>{});
await shot(`3057-${k}-folded.png`);}
return R;
