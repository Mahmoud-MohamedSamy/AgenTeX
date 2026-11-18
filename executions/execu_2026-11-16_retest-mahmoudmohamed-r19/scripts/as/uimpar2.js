const RAWP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/ev/imp19.csv';
const T0='88e8ea44-1658-4df3-9930-d0902b91073d';
const body0=async()=>(await page.innerText('main').catch(()=>page.innerText('body'))).replace(/\s+/g,' ');
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T0,{waitUntil:'commit'});await page.evaluate(()=>localStorage.setItem('anyware_language','ar'));await page.reload({waitUntil:'commit'});
for(let i=0;i<30;i++){await sleep(3000);if(/بدء الاستيراد|البدء من جديد/.test(await body0()))break;}
const so=page.getByRole('button',{name:/البدء من جديد/});if(await so.count()){log('start over');await so.first().click();await sleep(5000);}
await page.locator('input[type=file]').last().setInputFiles(RAWP,{timeout:20000});await sleep(6000);
for(let k=0;k<3;k++){await page.getByRole('button',{name:/^التالي$/}).last().click({timeout:15000});await sleep(5000);}
const t=await body0();log('ar step', t.slice(-1500));
await shot('2275-imp-6-assign-ar.png',{fullPage:true});
await page.evaluate(()=>localStorage.setItem('anyware_language','en'));await page.reload({waitUntil:'commit'});for(let i=0;i<20;i++){await sleep(3000);if(/Start over|Start import/i.test(await body0()))break;}
const so2=page.getByRole('button',{name:/^Start over$/});if(await so2.count()){await so2.first().click();await sleep(3000);log('cleared');}
return 'ok';
