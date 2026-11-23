const R={steps:[]};const M=async()=>(await page.locator('#main-content').innerText()).replace(/\s+/g,' ');
await page.goto(H+'/settings/data/import',{waitUntil:'domcontentloaded'});for(let i=0;i<50;i++){await sleep(3000);if(await page.getByText('Start import').count())break;}await sleep(2000);await shot('3132-1b.png');
await page.getByRole('button',{name:'Choose a module'}).click();await sleep(1200);await page.getByRole('option',{name:/^Tickets$/}).first().click().catch(async()=>{await page.getByText('Tickets',{exact:true}).last().click();});await sleep(1000);
await page.getByRole('button',{name:'Start import'}).click();await sleep(5000);R.steps.push((await M()).slice(0,700));await shot('3132-2.png');
const fi=page.locator('input[type=file]').first();await fi.setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/qa-rt26-3132.csv');await sleep(6000);
R.steps.push((await M()).slice(0,900));await shot('3132-3.png');R.btns=(await page.locator('#main-content button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean);
return R;
