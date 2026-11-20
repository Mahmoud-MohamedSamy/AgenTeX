const R={};
for(const [n,id,name] of [['sn3119-a-no-create-record','8421e150-a5fe-49a6-9631-88ece1182122','QA RT21 W2 3115 rapid'],['sn3119-b-create-record','1a704422-e849-4321-94ea-51177b6d1850','QA RT21 W2 3105 part']]){
 const bad=[];const h=r=>{if(r.status()===404)bad.push(r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').replace(/[?].*/,''));};page.on('response',h);
 await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'commit'});await page.getByText(name).first().waitFor({timeout:90000});await sleep(7000);
 R[n]={toast:await page.getByText('The requested resource was not found.').count(),notFound:[...new Set(bad)]};await shot(n+'.png',{timeout:90000});page.off('response',h);}
return R;
