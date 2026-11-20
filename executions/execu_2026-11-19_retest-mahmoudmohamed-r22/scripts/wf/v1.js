const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');const R={};
await page.goto(H+'/settings/automation/workflow-rules/09f71f2f-36df-416e-8f7a-c39634886b39',{waitUntil:'domcontentloaded'});await sleep(10000);
R.top=(await main().innerText()).replace(/\s+/g,' ').slice(0,1500);
await shot('3058-0-editor.png',{fullPage:true});
R.btns=(await main().getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(Boolean).slice(0,60);
return R;
