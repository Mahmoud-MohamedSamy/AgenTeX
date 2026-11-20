const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts';const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad';
const api=()=>execFileSync('bash',['-c',`cd "${W}" && APP=desk node apiw.js o ${S}/g3064f.js`],{encoding:'utf8'}).replace(/\s+/g,' ').slice(-200);
const R={};const open=async()=>{await page.goto(H+'/views/all/tickets/c2cacd94-4c69-4693-a58b-e1cbf5918e0d',{waitUntil:'commit'});await page.getByText('#5690').first().waitFor({timeout:120000});await sleep(4000);};
try{await open();await page.getByRole('button',{name:'Change contact'}).click({timeout:10000});await sleep(1500);await shot('3064-r1-e-change-dialog.png',{timeout:90000});
 await page.keyboard.type('QA RT22 Contact 2');await sleep(2500);await page.getByText('QA RT22 Contact 2').last().click({timeout:10000});await sleep(500);
 const sel=page.getByRole('button',{name:/^(Select|Save|Change)/}).last();await sel.click({timeout:10000});await sleep(3500);await shot('3064-r1-f-changed.png',{timeout:90000});R.afterChange=api();
 await page.getByRole('button',{name:'Remove contact'}).click({timeout:10000});await sleep(1500);const cf=page.getByRole('button',{name:/^(Remove|Confirm|Yes)/}).last();if(await cf.count())await cf.click().catch(()=>{});await sleep(3500);await shot('3064-r1-g-removed.png',{timeout:90000});R.afterRemove=api();
}catch(e){R.err=e.message.slice(0,200);await shot('3064-r1-dbg2.png',{timeout:60000}).catch(()=>{});}
return R;
