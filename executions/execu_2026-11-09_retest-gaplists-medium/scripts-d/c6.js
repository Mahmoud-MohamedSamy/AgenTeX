const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R}=I;const D='../ndc-2628/evidence/raw/';const o={};
const resp=[];page.on('response',async r=>{const q=r.request();const u=r.url();if(u.includes('/api/v1/')&&q.method()!=='GET'&&!/resolved-batch|realtime|heartbeat|iam\/auth|proofing/.test(u)){let t='';try{t=(await r.text()).slice(0,260)}catch(e){}resp.push(q.method()+' '+u.split('/api/v1')[1].slice(0,120)+' → '+r.status()+' '+t);}});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L+'/records/'+R,{waitUntil:'load',timeout:120000});await page.getByText('platypusnote').first().waitFor({timeout:90000});await page.waitForTimeout(1500);
await page.getByText('Files',{exact:true}).first().click();await page.waitForTimeout(3000);
const fc=page.waitForEvent('filechooser',{timeout:15000}).catch(()=>null);await page.getByText('+ Upload',{exact:true}).click();const ch=await fc;o.chooser=!!ch;
if(ch){o.accept=await page.evaluate(()=>[...document.querySelectorAll('input[type=file]')].map(i=>i.accept));await ch.setFiles('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/qa-rt-2628.txt');await page.waitForTimeout(7000);}
await page.screenshot({path:D+'files-txt.png'});
const body=await page.locator('body').innerText();o.fileMsgs=body.split('\n').filter(l=>/allowed|not supported|isn't|qa-rt-2628|can't|cannot/i.test(l)).slice(0,8);
// clone
await page.mouse.click(1372,123);await page.waitForTimeout(1200);await page.getByRole('menuitem',{name:'Clone'}).click();await page.waitForTimeout(5000);
o.cloneUrl=page.url().replace(H,'');await page.screenshot({path:D+'clone-form.png'});
const cb=(await page.locator('body').innerText()).split('\n').filter(l=>/clone|QA RT 2628/i.test(l)).slice(0,10);o.cloneText=cb;
o.resp=resp;resp.filter(x=>/→ 2/.test(x)).forEach(x=>LED('UI write: '+x.slice(0,200)));
return o;
