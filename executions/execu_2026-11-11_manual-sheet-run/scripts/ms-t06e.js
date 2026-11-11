// T-06-09 read-only share to Customer Support + Agent C view; T-06-05 signature probe; T-06-08 thread after reload.
const L=require('./lib');const path=require('path');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 const sh=await api('POST','/desk/tickets/'+id+'/shares',{shares:[{department_id:L.D.CS,access:'read_only'}]});R.share=sh.s+' '+sh.t.slice(0,160);LED('T-06-09 share ticket '+id+' read_only to Customer Support '+sh.s);
 const ctxB=await pg.context().browser().newContext({storageState:path.join(OUT,'agentc.json')});const pB=await ctxB.newPage();await pB.setViewportSize({width:1600,height:1000});
 await pB.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'}).catch(()=>{});await pB.waitForFunction(()=>/Ticket Owner|not available|Sign in|Log in/i.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pB.waitForTimeout(5000);
 const tB=(await pB.innerText('body')).replace(/\s+/g,' ');R.agent={signedOut:/Sign in|Log in/i.test(tB)&&!/Ticket Owner/.test(tB),opened:/Ticket Owner/.test(tB),notAvail:/not available/.test(tB),readOnlyNote:(tB.match(/[^.]{0,60}(read[- ]only|view only|shared with)[^.]{0,60}/i)||[''])[0]};
 R.agent.buttons=await pB.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,25)).filter(t=>/reply|forward|comment|send/i.test(t)));
 await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t06-09-agent-readonly.png')});
 const rb=pB.getByRole('button',{name:/^Reply( All)?$/}).first();if(R.agent.opened&&await rb.count()&&await rb.isVisible()){await rb.click().catch(()=>{});await pB.waitForTimeout(3000);R.agent.afterReply=(await pB.innerText('body')).replace(/\s+/g,' ').match(/[^.]{0,80}(not allowed|permission|read[- ]only|denied)[^.]{0,60}/i)?.[0]||'composer: '+await pB.locator('[contenteditable=true]').count();await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t06-09-agent-reply.png')});}
 await ctxB.storageState({path:path.join(OUT,'agentc.json')}).catch(()=>{});await ctxB.close();
 // signatures
 for(const p of ['/desk/my-signatures','/desk/signatures']){const r=await api('GET',p);R['sig '+p]=r.s+' '+r.t.slice(0,400);}
 try{
 await L.gotoTicket(id);await pg.reload({waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(6000);
 const tab=pg.locator('[role=tab]').filter({hasText:/conversation/i}).first();const ctl=await tab.getAttribute('aria-controls');
 R.thread=await pg.evaluate(c=>[...document.getElementById(c).querySelectorAll('article,[data-entry-id],li')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,90)).slice(0,12),ctl);
 R.threadText=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,700),ctl);await L.shot('t06-08-thread');}catch(e){R.err08=String(e.message).slice(0,100);await L.shot('t06-08-err');}return R;};
