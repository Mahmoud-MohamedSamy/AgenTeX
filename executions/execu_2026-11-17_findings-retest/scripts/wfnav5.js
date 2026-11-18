const urls=new Set();page.on('response',r=>{if(/\.js(\?|$)/.test(r.url()))urls.add(r.url());});
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await sleep(12000);
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});await sleep(8000);
const out=[];
for(const u of urls){try{const t=await (await page.request.get(u)).text();for(const m of t.matchAll(/.{200}(workflowExecutions|executions.title|executions.nav|viewExecutions|executionHistory)[^a-zA-Z].{200}/g))out.push(u.split('/').pop()+' :: '+m[0]);}catch(e){}}
log('n',urls.size);out.slice(0,25).forEach(x=>log(x));
