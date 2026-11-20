const R={};
await page.goto(H+'/settings/automation/workflow-rules/b3f7f4a3-def6-4cf3-8f33-53db39e40be7',{waitUntil:'domcontentloaded'});
await page.getByText('CONDITION').first().waitFor({timeout:90000}).catch(()=>{});await sleep(2000);
R.ls=await page.evaluate(()=>Object.keys(localStorage).map(k=>k+'='+String(localStorage.getItem(k)).slice(0,40)).filter(x=>/lang|locale|i18n/i.test(x)));
R.ck=(await ctx.cookies()).filter(c=>/lang|locale/i.test(c.name)).map(c=>c.name+'='+c.value);
return R;
