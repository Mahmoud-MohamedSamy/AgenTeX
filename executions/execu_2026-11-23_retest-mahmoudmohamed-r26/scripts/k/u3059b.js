const fs=require('fs');const V=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/scripts/k/vo.json','utf8'));const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\//.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status());});
const menuTxt=async()=>(await page.locator('[role=menu]:visible, [role=listbox]:visible, [data-radix-popper-content-wrapper]:visible').allInnerTexts().catch(()=>[])).join(' | ').replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/'+V.t1,{waitUntil:'commit'});await page.getByText('#7132').first().waitFor({timeout:120000});await sleep(7000);
await page.getByRole('button',{name:/^Actions/}).first().click();await sleep(1500);R.actions=await menuTxt();await shot('3059-actions.png');await page.keyboard.press('Escape');await sleep(800);
await page.locator('main button:has(svg)').filter({hasText:''}).last().click().catch(()=>{});
const dots=page.locator('button[aria-label*="more" i], button[aria-haspopup=menu]');R.dotsCount=await dots.count();
// header ⋮ at top-right
await page.mouse.click(1569,97);await sleep(1500);R.kebab=await menuTxt();await shot('3059-kebab.png');await page.keyboard.press('Escape');await sleep(800);
await page.getByText('Open',{exact:true}).nth(1).click().catch(e=>R.statusClickErr=String(e).slice(0,80));await sleep(1500);R.statusMenu=await menuTxt();await shot('3059-status.png');await page.keyboard.press('Escape');await sleep(800);
for(const [tab,n] of [['RESOLUTION','3059-resolution'],['ATTACHMENT','3059-attachment']]){await page.getByText(new RegExp('^'+tab+'$','i')).first().click({timeout:15000});await sleep(3000);
 R[tab]={buttons:(await page.locator('main button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(-10),editable:await page.locator('[contenteditable=true]:visible, textarea:visible, input[type=file]').count(),txt:(await page.locator('#main-content').innerText()).replace(/\s+/g,' ').slice(-300)};await shot(n+'.png');}
// comment icon button
await page.getByText(/^\d+ CONVERSATION$/i).first().click().catch(()=>{});await sleep(1500);
await page.mouse.click(1409,97);await sleep(2500);R.commentPanel=(await page.locator('body').innerText()).replace(/\s+/g,' ').match(/.{0,60}(private|public|comment).{0,160}/gi)?.slice(0,4);await shot('3059-comment.png');
return R;
