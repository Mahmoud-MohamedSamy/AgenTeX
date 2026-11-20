const T=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/3059.json','utf8'));const R={};
const bt=async()=>(await page.locator('main, body').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/'+T.id,{waitUntil:'commit'});await page.getByText('#'+T.n).first().waitFor({timeout:120000});await sleep(6000);
for(const [tab,n] of [['RESOLUTION','3059-r1-h-resolution-tab'],['ATTACHMENT','3059-r1-i-attachment-tab']]){await page.getByText(new RegExp('^'+tab+'$','i')).first().click({timeout:15000});await sleep(3000);
 R[tab]={buttons:(await page.locator('main button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(-12),editable:await page.locator('main [contenteditable=true]:visible, main textarea:visible').count()};await shot(n+'.png',{timeout:90000});}
return R;
