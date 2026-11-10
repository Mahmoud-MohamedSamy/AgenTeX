const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R}=I;const D='../ndc-2628/evidence/raw/';const o={};
const resp=[];page.on('response',async r=>{const q=r.request();const u=r.url();if(u.includes('/api/v1/')&&q.method()!=='GET'&&!/resolved-batch|realtime|heartbeat|iam\/auth/.test(u)){let t='';try{t=(await r.text()).slice(0,200)}catch(e){}resp.push(q.method()+' '+u.split('/api/v1')[1].slice(0,120)+' → '+r.status()+' '+t);}});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L+'/records/'+R,{waitUntil:'load',timeout:120000});await page.getByText('platypusnote').first().waitFor({timeout:90000});await page.waitForTimeout(2000);
await page.mouse.click(1372,123);await page.waitForTimeout(1500);o.kebab=await page.locator('[role=menuitem]').allInnerTexts();await page.screenshot({path:D+'record-kebab.png'});await page.keyboard.press('Escape');
// edit note
await page.getByRole('button',{name:'Edit note'}).first().click();await page.waitForTimeout(1500);await page.screenshot({path:D+'note-edit-open.png'});
const ed=page.locator('[contenteditable=true]').last();await ed.click();await page.keyboard.press('End');await page.keyboard.type(' EDITED');
const save=page.getByRole('button',{name:/^(save|update|save note)$/i});o.saveBtns=await save.count();if(o.saveBtns){await save.last().click();await page.waitForTimeout(4000);}
await page.screenshot({path:D+'note-edited.png'});o.editedShown=await page.getByText(/platypusnote EDITED/).count();o.editedTag=await page.getByText(/edited/i).count();
// files tab: attach txt
await page.getByRole('tab',{name:/^files$/i}).first().click().catch(()=>page.getByText('Files',{exact:true}).first().click());await page.waitForTimeout(4000);
const inp=page.locator('input[type=file]');o.fileInputs=await inp.count();
if(o.fileInputs){await inp.first().setInputFiles('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/qa-rt-2628.txt');await page.waitForTimeout(6000);}
await page.screenshot({path:D+'files-txt.png'});
const body=await page.locator('body').innerText();o.fileMsgs=body.split('\n').filter(l=>/allowed|not supported|type|qa-rt-2628|upload/i.test(l)).slice(0,8);
o.resp=resp;resp.filter(x=>/attachments|files/.test(x)&&/→ 2/.test(x)).forEach(x=>LED('UI upload: '+x.slice(0,160)));
return o;
