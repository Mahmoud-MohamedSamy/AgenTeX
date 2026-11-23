const R={steps:[]};const B=async()=>(await page.locator('body').innerText()).replace(/\s+/g,' ');
await page.goto(H+'/settings/data/import',{waitUntil:'domcontentloaded'});for(let i=0;i<50;i++){await sleep(3000);if(await page.getByText('Start import').count())break;}await sleep(2000);
await page.mouse.click(618,266);await sleep(1500);await page.getByRole('option',{name:'Tickets',exact:true}).first().click();await sleep(1000);await page.getByRole('button',{name:/Start import/}).click();await page.getByText('Upload your file').waitFor({timeout:60000});await sleep(1500);
await page.locator('input[type=file]').last().setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/qa-rt26-3132.csv');await sleep(4000);await shot('3132-s1.png');
for(let s=2;s<=4;s++){const nx=page.getByRole('button',{name:/^Next$/});await nx.click({timeout:30000});await sleep(5000);const t=await B();R.steps.push(t.slice(0,600));await shot('3132-s'+s+'.png');if(/Trigger automation/i.test(t))break;}
const t=await B();R.assign=(t.match(/.{0,400}Trigger automation.{0,500}/i)||[])[0];await shot('3132-assign.png',{fullPage:true});
return R;
