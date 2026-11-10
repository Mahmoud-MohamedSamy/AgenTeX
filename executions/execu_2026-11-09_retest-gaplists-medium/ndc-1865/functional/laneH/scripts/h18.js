out.loaded=await openTicket();await page.waitForTimeout(2000);
let step='reply';try{
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(2500);
step='insert';await page.locator('button:has-text("Insert template")').first().click();await page.waitForTimeout(3000);
out.picker=(await body()).split('\n').filter(l=>/QA FT 1865 H|template|folder/i.test(l)).slice(0,12);await shot('t1-template-picker');
const search=page.locator('[role=dialog] input[type=search], [role=dialog] input[placeholder*="earch" i]').first();if(await search.count()){await search.fill('QA FT 1865 H');await page.waitForTimeout(2000);}
step='pick';await page.locator('text=QA FT 1865 H template').first().click({timeout:15000});await page.waitForTimeout(2000);
const ib=page.locator('[role=dialog] button').filter({hasText:/^(Insert|Use|Apply)/}).first();if(await ib.count()){out.insertBtn=await ib.innerText();await ib.click();}
await page.waitForTimeout(3000);
const ed=page.locator('[contenteditable=true]').first();out.editor=(await ed.innerText()).slice(0,300);
const t=await body();out.subject=(t.match(/Subject\s*\n([^\n]+)/)||[])[1];out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
await shot('t2-template-inserted');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('t-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
