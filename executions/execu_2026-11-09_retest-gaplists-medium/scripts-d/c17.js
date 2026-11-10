const D='../ndc-2628/evidence/raw/';const o={};
await page.route('**/api/v1/**',q=>{const m=q.request().method();const u=q.request().url();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query/.test(u))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:900});
for(const [q,f] of [['platypusnote','search-note.png'],['#quokkatag','search-hashtag.png'],['quokkatag','search-tag.png']]){
 await page.goto(H+'/search?q='+encodeURIComponent(q),{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);
 await page.screenshot({path:D+f});o[q]={url:page.url().replace(H,''),lines:(await page.locator('main').innerText().catch(()=>'')).split('\n').filter(Boolean).slice(0,8)};}
return o;
