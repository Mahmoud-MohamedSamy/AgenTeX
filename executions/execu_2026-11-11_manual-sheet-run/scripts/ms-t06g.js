const L=require('./lib');const path=require('path');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 // Agent C on the read-only shared ticket
 const ctxB=await pg.context().browser().newContext({storageState:path.join(OUT,'agentc.json')});const pB=await ctxB.newPage();await pB.setViewportSize({width:1600,height:1000});
 await pB.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'}).catch(()=>{});await pB.waitForFunction(()=>/Ticket Owner|not available/i.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pB.waitForTimeout(6000);
 const tB=(await pB.innerText('body')).replace(/\s+/g,' ');R.agent={opened:/Ticket Owner/.test(tB),notAvail:/not available/.test(tB),note:(tB.match(/[^.]{0,80}(read[- ]only|view only|shared)[^.]{0,80}/i)||[''])[0]};
 R.agent.buttons=await pB.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,30)).filter(t=>/reply|forward|comment|send/i.test(t)));
 await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t06-09-agent-readonly.png')});
 const rb=pB.getByRole('button',{name:/^Reply( All)?$/}).first();if(R.agent.opened&&await rb.count()&&await rb.isVisible()){await rb.click().catch(()=>{});await pB.waitForTimeout(3000);R.agent.afterReply=(await pB.innerText('body')).replace(/\s+/g,' ').match(/[^.]{0,80}(not allowed|permission|read[- ]only|denied)[^.]{0,60}/i)?.[0]||'composer editors: '+await pB.locator('[contenteditable=true]').count();await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t06-09-agent-reply.png')});}
 const mw=pB.getByRole('button',{name:'More ways to reply'}).first();if(R.agent.opened&&await mw.count()){await mw.click().catch(()=>{});await pB.waitForTimeout(1000);R.agent.moreMenu=await pB.locator('[role=menuitem]').allInnerTexts();}
 await ctxB.storageState({path:path.join(OUT,'agentc.json')}).catch(()=>{});await ctxB.close();
 // My Profile signature
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/hq',{waitUntil:'commit'}).catch(()=>{});await pg.waitForTimeout(8000);await pg.getByRole('button',{name:'Open profile'}).click();await pg.waitForTimeout(1500);
 await pg.getByText('My Profile',{exact:true}).click();await pg.waitForTimeout(5000);R.profileUrl=pg.url();R.profile=(await L.body_txt()).replace(/^.*?My Profile/,'').slice(0,900);await L.shot('t06-05-myprofile');
 return R;};
