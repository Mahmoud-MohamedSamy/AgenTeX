const R={};const reqs=[];
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(.*tags|workflow\/rules)/.test(u)&&r.request().method()!=='OPTIONS'){let b='';try{b=(await r.text()).slice(0,500);}catch(e){}reqs.push(r.request().method()+' '+u.replace(H,'')+' '+r.status()+' req='+(r.request().postData()||'').slice(0,300)+' res='+b);}});
await page.goto(H+'/settings/automation/workflow-rules/47752153-cc19-4572-90e2-bb487f25f45e',{waitUntil:'commit'});
const inp=page.locator('input[placeholder*="tag"]').first();await inp.waitFor({timeout:150000});await sleep(3000);
await inp.scrollIntoViewIfNeeded();await inp.click();await inp.fill('QA WF tag A');await sleep(2500);
await page.getByText('QA WF tag A',{exact:true}).last().click();await sleep(1500);
await inp.fill('QA RT21 WF F03 newtag');await sleep(2500);
await page.getByText('Create "QA RT21 WF F03 newtag"').first().click();await sleep(4000);
R.body=(await page.locator('body').innerText()).match(/.{0,80}(QA RT21 WF F03 newtag|colou?r|Created|error).{0,80}/gi)?.slice(0,6);
await shot('F03-4-after-create.png');
const dlg=page.getByRole('dialog');if(await dlg.count()){R.dialog=(await dlg.first().innerText()).replace(/\s+/g,' ').slice(0,300);}
R.chips=(await inp.locator('xpath=ancestor::div[2]').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200);
await page.keyboard.press('Escape');await sleep(500);
await page.getByRole('button',{name:'Save',exact:true}).click();await sleep(6000);
R.after=(await page.locator('body').innerText()).match(/.{0,60}(saved|Saved|error|Error).{0,80}/g)?.slice(0,4);
await shot('F03-5-saved.png');
R.reqs=reqs;return R;
