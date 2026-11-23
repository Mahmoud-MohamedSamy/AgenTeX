const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts';
const R={};await page.goto(H+'/views/all',{waitUntil:'commit'});await sleep(5000);await page.getByText('All Tickets').first().click();await page.getByText('QA RT22 BS 3096 open while moved').first().waitFor({timeout:90000});await sleep(2000);
const row=page.locator('div,li,tr').filter({has:page.getByText('QA RT22 BS 3096 open while moved')}).filter({hasText:'Sales'}).last();
await row.getByText(/^Sales/).first().click({timeout:10000});await sleep(1500);R.picker=(await page.locator('[role=menuitem],[role=option],[role=dialog]').allInnerTexts()).map(s=>s.replace(/\s+/g,' ').slice(0,200)).slice(0,6);await shot('3095-r1-b-picker.png',{timeout:90000});
await page.getByRole('menuitem',{name:/^Customer Support/}).or(page.getByRole('option',{name:/^Customer Support/})).first().click({timeout:10000});await sleep(2000);
const cf=page.getByRole('button',{name:/^(Move|Confirm)/}).last();if(await cf.count()&&await cf.isVisible().catch(()=>false)){await cf.click();}await sleep(4000);await shot('3095-r1-c-moved.png',{timeout:90000});
R.dept=execFileSync('bash',['x56/runo.sh','d3095.js'],{cwd:W,encoding:'utf8'}).replace(/\s+/g,' ').slice(-40);return R;
