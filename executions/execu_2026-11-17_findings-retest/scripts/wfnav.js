await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});
await page.getByText(/Execution History/i).first().waitFor({timeout:150000}).catch(()=>{});await sleep(5000);
const els=await page.getByText(/Execution History/i).all();
for(const e of els){const b=await e.boundingBox().catch(()=>null);const tag=await e.evaluate(n=>n.tagName+' '+(n.closest('a,button')?n.closest('a,button').outerHTML.slice(0,200):'')).catch(()=>'');log(JSON.stringify(b),tag);}
await shot('wf-nav-execution-history.png');
log(page.url());
