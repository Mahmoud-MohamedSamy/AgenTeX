const main=()=>page.locator('main').last();const R={};
await ctx.addInitScript(()=>{try{localStorage.setItem('anyware_language','ar');}catch(e){}});
for(const [k,id] of [['desk','b3f7f4a3-def6-4cf3-8f33-53db39e40be7'],['rel','9f6fde07-08f1-4491-81c1-c68c23c4eacf']]){
await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'commit'});await page.getByText('1',{exact:true}).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
R[k+'dir']=await page.evaluate(()=>document.documentElement.dir+' '+document.documentElement.lang);
const t=(await main().innerText()).replace(/\s+/g,' ');R[k]=t.slice(0,1200);
await page.mouse.wheel(0,250);await sleep(800);await shot(`3057-7-arabic-${k}.png`);}
return R;
