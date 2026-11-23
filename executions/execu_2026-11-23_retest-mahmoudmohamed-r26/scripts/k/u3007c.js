const id='1dc9f6e3-6899-4e1c-af5c-50019b5f77d7';const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|modules)/.test(u)&&!/heartbeat|summaries|read$|realtime|drafts/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status());});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#7152').first().waitFor({timeout:150000});await sleep(8000);
R.fs=((await page.locator('body').innerText()).replace(/\s+/g,' ').match(/Forum Status .{0,30}/)||[])[0];await shot('3007-fs-follow.png');
await page.getByRole('button',{name:/Post reply to forum/}).first().click();await sleep(3000);await shot('3007-reply-composer.png');
await page.locator('[contenteditable=true]:visible').first().click();await page.keyboard.type('QA RT26 3007 reply from the ticket to the forum');await sleep(800);
const send=page.getByRole('button',{name:'Post',exact:true}).first();R.sendLabel=await send.innerText().catch(()=>'');await send.click();await sleep(6000);
R.toast=((await page.locator('body').innerText()).replace(/\s+/g,' ').match(/.{0,40}(posted|forum topic|failed|error).{0,100}/i)||[])[0];await shot('3007-reply-posted2.png');
return R;
