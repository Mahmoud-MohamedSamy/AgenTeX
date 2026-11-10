out.loaded=await openTicket();await page.waitForTimeout(2000);
let step='open';try{
await page.mouse.click(1372,103);await wt(/Write a note only agents/);await page.waitForTimeout(1000);
step='type';const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.press('Control+A');await page.keyboard.type('QA FT 1865 H public comment: notification rule check, please ignore.');
step='arrow';const b=page.locator('button').filter({hasText:/^Comment/}).first();const bb=await b.boundingBox();out.bb=bb;
const btns=await page.locator('button').evaluateAll((bs,y)=>bs.map(b=>({a:b.getAttribute('aria-label'),t:b.innerText.trim().slice(0,15),r:b.getBoundingClientRect().toJSON()})).filter(x=>Math.abs(x.r.y-y)<20),bb.y);out.row=btns.map(x=>x.t+'|'+x.a+'|'+Math.round(x.r.x));
const arrow=btns.find(x=>!x.t&&x.r.x>bb.x+bb.width-5&&x.r.x<bb.x+bb.width+40);if(!arrow)throw new Error('no arrow');
await page.mouse.click(arrow.r.x+arrow.r.width/2,arrow.r.y+arrow.r.height/2);await page.waitForTimeout(1500);
out.menu=(await page.locator('[role=menu]').allInnerTexts()).slice(0,2);await shot('n1-comment-menu');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('n-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
