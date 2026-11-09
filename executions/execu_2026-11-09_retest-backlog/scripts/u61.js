const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const fs=require('fs');const LED=m=>fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const o={};await page.setViewportSize({width:1600,height:900});const writes=[];
page.on('request',r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.method())&&!/heartbeat|resolved-batch|iam\/auth|realtime|summaries/.test(r.url())){const p=r.postData()||'';const m=p.match(/"fieldName":"qa_rt9_(pick|contact)"[^]*?"datatypeOptions":\{[^]*?\}\}?/);writes.push(r.method()+' '+r.url().replace(/.*api\/v1/,'')+' '+(m?m[0].slice(0,700):p.slice(0,200)));}});
page.on('response',async r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.request().method())&&!/heartbeat|resolved-batch|realtime|summaries/.test(r.url()))writes.push('  -> '+r.status());});
await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/a539323e-9252-4967-a1b6-bb3e69f7c300',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('QA RT9 Pick',{exact:true}).first().waitFor({timeout:240000});await sleep(4000);
const openProps=async label=>{const l=page.getByText(label,{exact:true}).first();await l.scrollIntoViewIfNeeded();await l.hover();await sleep(800);
 await l.locator('xpath=ancestor::*[.//button][1]').getByRole('button',{name:'Field options'}).click();await sleep(1500);
 await page.getByText('Edit Properties',{exact:true}).last().click();await sleep(3000);await page.getByText('ADVANCED',{exact:true}).last().click();await sleep(1500);};
// pick list: bulk add, then sort
await openProps('QA RT9 Pick');
await page.getByText('Add values in bulk',{exact:true}).click();await sleep(1500);
await page.getByPlaceholder('Type or paste values, one per line').fill('gamma\nalpha\nbeta\nzeta');await sleep(1000);
o.bulkMsg=(await page.innerText('body')).match(/\d+ new values?[^\n]*/)?.[0];
await page.getByRole('button',{name:/^Add \d+ values?$/}).click();await sleep(1500);
const vals=async()=>page.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.childElementCount===0&&x.textContent.trim()==='Field Properties');let d=e;for(let i=0;i<10&&d;i++){d=d.parentElement;if(d&&d.innerText.includes('Apply')&&d.innerText.includes('ADVANCED'))break;}return [...d.querySelectorAll('input')].filter(i=>(i.type==='text'||!i.getAttribute('type'))&&!i.placeholder).map(i=>i.value).filter(Boolean);});
o.afterBulk=await vals();
await page.getByText('Sort A–Z',{exact:true}).click();await sleep(1000);o.afterSort=await vals();
await page.screenshot({path:SS+'2174-06b-bulk-sorted.png'});
await page.getByRole('button',{name:'Apply',exact:true}).last().click();await sleep(2000);
// lookup: filter + search fields
await openProps('QA RT9 Contact');
const before=new Set((await page.innerText('body')).split('\n'));
await page.getByText('Add criterion',{exact:true}).click();await sleep(1500);
o.critNew=(await page.innerText('body')).split('\n').filter(x=>x.trim()&&!before.has(x)).slice(0,40);
o.critCtrls=await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.childElementCount===0&&x.textContent.trim()==='Field Properties');let d=e;for(let i=0;i<10&&d;i++){d=d.parentElement;if(d&&d.innerText.includes('Apply')&&d.innerText.includes('ADVANCED'))break;}const t=[...d.querySelectorAll('*')].find(x=>x.childElementCount===0&&/filter the records/i.test(x.textContent));let c=t;for(let i=0;i<3;i++)c=c.parentElement;return [...c.querySelectorAll('select,input,button')].map(x=>x.tagName+':'+(x.getAttribute('aria-label')||x.placeholder||'')+':'+(x.tagName==='SELECT'?[...x.options].map(o=>o.value).slice(0,14).join('|'):x.value||x.innerText).slice(0,200));});
await page.screenshot({path:SS+'u61-lookup-crit.png'});
return {o,writes};
