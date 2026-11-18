await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});
await page.getByText('Workflow Rules').first().waitFor({timeout:150000});await sleep(5000);
await page.getByRole('row').nth(1).getByRole('cell').nth(1).click();await sleep(6000);
log('url',page.url());
const txt=await page.evaluate(()=>document.body.innerText);log('exec?',/execution|history/i.test(txt));
const els=await page.getByText(/Execution History|History/i).all();for(const e of els){log(await e.evaluate(n=>n.tagName+' '+n.innerText.slice(0,40)),JSON.stringify(await e.boundingBox()));}
await shot('wf-rule-detail.png');
