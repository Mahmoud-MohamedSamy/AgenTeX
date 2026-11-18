const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');const R={};
await page.goto(H+'/settings/automation/workflow-rules/20388e6d-8143-40f7-9941-8c6febf2077e',{waitUntil:'domcontentloaded'});await sleep(10000);
const hd=main().locator('button',{hasText:/^Add Tags$/}).first();if(await hd.count()&&!(await main().locator('input[placeholder="Search tags…"]').count()))await clk(hd);await sleep(1500);
const inp=main().locator('input[placeholder="Search tags…"]').first();R.ph=await inp.getAttribute('placeholder');
R.chips=(await inp.locator('xpath=ancestor::div[2]').innerText()).replace(/\s+/g,' ').slice(0,200);
await inp.click();await sleep(1500);R.optsEmpty=(await page.getByRole('option').allInnerTexts()).slice(0,10);
await inp.fill('QA WF tag');await sleep(2500);R.opts=(await page.getByRole('option').allInnerTexts()).slice(0,10);
await inp.scrollIntoViewIfNeeded();await shot('3058-5-existing-tag-options.png');
const o=page.getByRole('option',{name:/QA WF tag A/}).first();if(await o.count()){await o.click();}else{const t=page.getByText('QA WF tag A',{exact:true}).last();await t.click().catch(e=>R.clickErr=String(e.message).slice(0,100));}
await sleep(1500);R.chips2=(await inp.locator('xpath=ancestor::div[3]').innerText()).replace(/\s+/g,' ').slice(0,300);
await shot('3058-6-existing-tag-picked.png');
await page.getByRole('button',{name:'Save',exact:true}).click();await sleep(5000);
R.after=(await page.locator('body').innerText()).match(/.{0,60}(saved|Saved|error|Error).{0,80}/g)?.slice(0,4);
return R;
