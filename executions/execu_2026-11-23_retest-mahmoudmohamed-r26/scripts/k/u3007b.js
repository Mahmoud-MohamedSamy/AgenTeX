const id='1dc9f6e3-6899-4e1c-af5c-50019b5f77d7';const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|modules)/.test(u)&&!/heartbeat|summaries|read$|realtime/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,160));});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#7152').first().waitFor({timeout:150000});await sleep(8000);
const lab=page.getByText('Forum Status',{exact:true}).first();await lab.scrollIntoViewIfNeeded();const bb=await lab.boundingBox();R.bb=bb;
await page.mouse.click(bb.x+30,bb.y+32);await sleep(1500);R.opts=(await page.locator('[role=option]:visible, [role=menuitem]:visible, [role=listbox] li:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(0,12);await shot('3007-fs-menu.png');
const pick=R.opts.find(o=>/progress|analy|answered/i.test(o))||R.opts.find(o=>!/no status/i.test(o));if(pick){await page.getByRole('option',{name:pick}).first().click().catch(async()=>page.getByText(pick,{exact:true}).last().click());R.picked=pick;}
await sleep(3500);await shot('3007-fs-after.png');R.after=((await page.locator('body').innerText()).replace(/\s+/g,' ').match(/Forum Status .{0,40}/)||[])[0];
return R;
