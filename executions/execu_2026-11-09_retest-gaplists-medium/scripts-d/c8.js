const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const D='../ndc-2628/evidence/raw/';const o={};
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|views\/.*\/records|records\/query|records\/search|list/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L,{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);o.url=page.url().replace(H,'');
await page.screenshot({path:D+'list.png'});
const btns=await page.locator('button:visible').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,40)).filter(Boolean));o.btns=[...new Set(btns)].slice(0,60);
return o;
