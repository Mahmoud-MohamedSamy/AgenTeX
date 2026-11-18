// Arabic help text on Import > Assign step; no import is submitted.
const RAWP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/ev/imp19.csv';
const T0='88e8ea44-1658-4df3-9930-d0902b91073d';
const body0=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const clk=async re=>{const b=page.getByRole('button',{name:re}).last();await b.click({timeout:15000});await sleep(5000);};
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T0,{waitUntil:'commit'});await page.evaluate(()=>localStorage.setItem('anyware_language','en'));
for(let i=0;i<30;i++){await sleep(3000);if(/Start import|Start over/i.test(await body0()))break;}
const so=page.getByRole('button',{name:/^Start over$/});if(await so.count()){log('start over');await so.first().click();await sleep(5000);}
await page.locator('input[type=file]').last().setInputFiles(RAWP,{timeout:20000});await sleep(6000);
await clk(/^Next$/);await clk(/^Next$/);await clk(/^Next$/);
let t=await body0();log('en has new text',/A row with no owner is assigned to you/.test(t),'old text',/regardless/.test(t));
// switch to Arabic in this browser only
await page.evaluate(()=>localStorage.setItem('anyware_language','ar'));await page.reload({waitUntil:'commit'});for(let i=0;i<20;i++){await sleep(3000);const b=await body0();if(b.length>500)break;}await sleep(4000);
t=await body0();log('ar dir',await page.evaluate(()=>document.documentElement.dir),'ar text',t.slice(0,1500));
await shot('2275-imp-6-assign-ar.png',{fullPage:true});
// Arabic: try to reach the assign step if reload went back
const nx=page.getByRole('button',{name:/التالي/});log('ar next buttons',await nx.count());
for(let k=0;k<3&&!/تشغيل|الأتمتة/.test(await body0());k++){if(await nx.count()){await nx.last().click().catch(()=>{});await sleep(5000);}}
t=await body0();log('ar text2',t.slice(0,2500));await shot('2275-imp-7-assign-ar2.png',{fullPage:true});
await page.evaluate(()=>localStorage.setItem('anyware_language','en'));await page.reload({waitUntil:'commit'});for(let i=0;i<20;i++){await sleep(3000);if(/Start over|Start import/i.test(await body0()))break;}
const so2=page.getByRole('button',{name:/^Start over$/});if(await so2.count()){await so2.first().click();await sleep(3000);log('cleared');}
return 'ok';
