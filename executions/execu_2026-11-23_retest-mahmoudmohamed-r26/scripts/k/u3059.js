const fs=require('fs');const V=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/scripts/k/vo.json','utf8'));const R={};
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for (const [k,id,n] of [['open',V.t1,7132],['closed',V.t2,7133]]) {
 await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#'+n).first().waitFor({timeout:120000});await sleep(7000);
 const btns=(await page.locator('button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean);
 R[k]={replyAll:btns.filter(b=>/reply|forward|close ticket|^edit$|send/i.test(b)),banner:((await bt()).match(/.{0,30}(view only|view-only|cannot reply|can view).{0,120}/i)||[])[0], editable:await page.locator('[contenteditable=true]:visible, textarea:visible').count()};
 await shot('3059-'+k+'.png',{timeout:90000});
}
return R;
