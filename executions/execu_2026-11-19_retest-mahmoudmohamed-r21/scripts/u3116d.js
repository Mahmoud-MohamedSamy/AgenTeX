const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r21/scripts';
const run=f=>execFileSync('node',['apiw.js','o','C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/'+f],{cwd:W,env:{...process.env,APP:'desk'},encoding:'utf8'}).replace(/\s+/g,' ').slice(-120);
const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'});await page.getByText('tier_1_support').first().waitFor({timeout:120000});await sleep(2000);
await page.getByRole('button',{name:/Add skill|New skill/i}).first().click({timeout:15000});await sleep(2500);
await page.getByLabel(/Skill name/).first().fill('QA RT21 SK 3116 stale');
await page.getByText('Choose a skill type').first().click();await sleep(800);await page.getByRole('option').first().click().catch(async()=>{await page.getByText('General',{exact:true}).last().click();});await sleep(500);
await page.getByText('Customer Experience Specialists 1',{exact:true}).last().click();await sleep(500);
try{R.on=run('vo-on.js');await sleep(1500);
 await page.getByRole('button',{name:'Save',exact:true}).last().click();await sleep(3500);const t=await bt();const k=t.search(/view-only access|can.t have its skills|invalid/i);R.msg=k>=0?t.slice(Math.max(0,k-120),k+200):'(none)';await shot('3116-r1-d-named-refusal.png',{timeout:90000});
}finally{R.off=run('vo-off.js');}
return R;
