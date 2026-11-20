const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad';
require('fs').writeFileSync(S+'/g3064.js',"const r=await rec('c2cacd94-4c69-4693-a58b-e1cbf5918e0d');return {priority:r.priority,phone:r.phone,contact:r.contact_id||r.contact,email:r.email};");
const api=()=>execFileSync('bash',['-c',`cd "${W}" && cat x56/lib.js ${S}/g3064.js > ${S}/g3064f.js && APP=desk node apiw.js o ${S}/g3064f.js`],{encoding:'utf8'}).replace(/\s+/g,' ').slice(-220);
const R={};const open=async()=>{await page.goto(H+'/views/all/tickets/c2cacd94-4c69-4693-a58b-e1cbf5918e0d',{waitUntil:'commit'});await page.getByText('#5690').first().waitFor({timeout:120000});await sleep(4000);await page.getByRole('button',{name:/^Edit$/}).first().click({timeout:15000});await sleep(2500);};
const pickContact=async name=>{const f=page.getByText(/Choose a record/).first();await f.scrollIntoViewIfNeeded();await f.click({timeout:10000});await sleep(800);await page.keyboard.type(name);await sleep(2500);await page.getByText(name,{exact:false}).last().click({timeout:10000});await sleep(500);await page.getByRole('button',{name:'Select',exact:true}).last().click({timeout:10000});await sleep(1000);};
const save=async n=>{const sv=page.getByRole('button',{name:/^Save( changes)?$/}).last();await sv.scrollIntoViewIfNeeded().catch(()=>{});await sv.click({timeout:10000});await sleep(4000);await shot(n,{timeout:90000});};
try{await open();
 await page.getByPlaceholder('+1 (555) 000-0000').first().fill('01002223333');
 const pr=page.locator('[role=dialog]').getByText('Priority',{exact:true}).first();await pr.scrollIntoViewIfNeeded();const box=pr.locator('xpath=following::*[self::button or self::select or @role="combobox"][1]');R.prTag=await box.evaluate(e=>e.tagName+' '+(e.innerText||'').slice(0,30)).catch(e=>'x');if(R.prTag.startsWith('SELECT'))await box.selectOption({label:'High'});else{await box.click();await sleep(600);await page.getByRole('option',{name:'High'}).first().click();}
 await pickContact('QA RT22 Contact 1');await shot('3064-r1-b-form-filled.png',{timeout:90000});await save('3064-r1-c-saved.png');R.afterSave1=api();
 await open();await pickContact('QA RT22 Contact 2');await save('3064-r1-d-changed.png');R.afterChange=api();
}catch(e){R.err=e.message.slice(0,200);await shot('3064-r1-dbg.png',{timeout:60000}).catch(()=>{});}
return R;
