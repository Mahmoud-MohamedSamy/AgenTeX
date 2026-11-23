const id='1dc9f6e3-6899-4e1c-af5c-50019b5f77d7';const R={};
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#7152').first().waitFor({timeout:150000});await sleep(8000);
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');R.forumStatus=/forum status/i.test(t);R.community=(t.match(/.{0,80}(Community topic|forum).{0,160}/gi)||[]).slice(0,4);
await shot('3007-ticket.png');
const props=page.getByText('Ticket Properties').first();await page.mouse.wheel(0,0);
await page.locator('aside, [data-testid*=properties]').first().evaluate(e=>e.scrollTop=e.scrollHeight).catch(()=>{});await sleep(1000);await shot('3007-props-bottom.png');
R.btns=(await page.locator('button:visible').allInnerTexts()).map(s=>s.trim()).filter(s=>/forum|post|reply/i.test(s));
return R;
