await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await sleep(8000);
const r=await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u));const out=[];for(const u of urls){try{const t=await (await fetch(u)).text();let i=-1;let n=0;while((i=t.indexOf('onnected',i+1))>=0&&n<12){out.push(u.split('/').pop()+': '+t.slice(Math.max(0,i-120),i+120));n++;}}catch(e){}}return {n:urls.length,out};});
return r;
