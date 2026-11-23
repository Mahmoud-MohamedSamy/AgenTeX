const R={steps:[]};const M=async()=>(await page.locator('#main-content').innerText()).replace(/\s+/g,' ');
await page.goto(H+'/settings/data/import',{waitUntil:'domcontentloaded'});for(let i=0;i<50;i++){await sleep(3000);if(await page.getByText('Start import').count())break;}await sleep(2000);
const sel=page.locator('select:visible');R.sel=await sel.count();
if(R.sel){R.opts=await sel.first().evaluate(s=>[...s.options].map(o=>o.text));await sel.first().selectOption({label:'Tickets'});}
else{await page.mouse.click(618,266);await sleep(1500);R.opts=(await page.locator('[role=option]:visible, [role=listbox] *:visible').allInnerTexts()).slice(0,20);await shot('3132-opts.png');await page.getByRole('option',{name:'Tickets',exact:true}).first().click();}
await sleep(1500);await page.getByRole('button',{name:/Start import/}).click();await sleep(6000);R.steps.push((await M()).slice(0,900));await shot('3132-2.png');
const fi=page.locator('input[type=file]');R.fi=await fi.count();if(R.fi){await fi.first().setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/qa-rt26-3132.csv');await sleep(6000);R.steps.push((await M()).slice(0,900));await shot('3132-3.png');}
R.btns=(await page.locator('#main-content button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean);
return R;
