// T-06-03 forward the first (customer) message to M2, T-06-06 long paste via real clipboard. Then mailboxes.
const L=require('./lib');
module.exports=async()=>{const R={};try{const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 const m2=JSON.parse(require('fs').readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/ms-mailboxes.json')).M2.address;
 const toast=async()=>{let s='';for(let i=0;i<15&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const send=async()=>{let b=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const x=c.nth(i);if(await x.isVisible().catch(()=>false)&&!(await x.isDisabled().catch(()=>true)))b=x;}if(!b)return 'Send disabled';await b.click();return toast();};
 R.copiedBefore=(await api('GET','/desk/tickets/'+id+'/cc')).t.slice(0,200);
 R.step="fwd";if(!process.env.SKIPFWD){
 await L.gotoTicket(id);const acts=pg.getByRole('button',{name:'Conversation entry action'});R.entryActs=await acts.count();
 await acts.last().scrollIntoViewIfNeeded().catch(()=>{});await acts.last().click({force:true,timeout:10000}).catch(e=>R.actErr=String(e.message).slice(0,80));await pg.waitForTimeout(1200);R.entryMenu=await pg.locator('[role=menuitem]').allInnerTexts();
 const fw=pg.getByRole('menuitem',{name:/^forward$/i}).first();if(await fw.count()){await fw.click();await pg.waitForTimeout(4000);
  R.recIn=await pg.locator('input[aria-label="Recipients"]').count();await pg.locator('input[aria-label="Recipients"]').last().click({force:true,timeout:10000}).catch(e=>R.recErr=String(e.message).slice(0,60));await pg.waitForTimeout(500);await pg.keyboard.type(m2);await pg.keyboard.press('Enter');await pg.waitForTimeout(800);
  R.recip=(await L.body_txt()).match(/Recipients .{0,80}/)?.[0];
  R.step="fwd-editor";const fe=pg.locator('[contenteditable=true][aria-label="Reply body"]').last();await fe.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN forward note for M2');await pg.keyboard.press('Enter');
  R.fwdBody=(await fe.innerText()).slice(0,300);await L.shot('t06-03-fwd-composer2');R.fwdSend=await send();R.fwdAt=new Date().toISOString();await pg.waitForTimeout(5000);}
 else await pg.keyboard.press('Escape');
 }R.step="paste";
 await pg.context().grantPermissions(['clipboard-read','clipboard-write'],{origin:H});
 await L.gotoTicket(id);await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await pg.waitForTimeout(4000);const ed=pg.locator('[contenteditable=true][aria-label="Reply body"]').last(); await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN long reply start');await pg.keyboard.press('Enter');
 const para='QA MAN long reply paragraph. '+'Refund policy text for the customer, repeated to fill a page. '.repeat(14);
 const img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIklEQVR42mNkYGD4z0ABYBzVMKoBRgFGNYxqGFUwqgEAWX4D/1WeYQ8AAAAASUVORK5CYII=';
 const html='<h2>QA MAN pasted from Word</h2>'+Array.from({length:9},()=>'<p>'+para+'</p>').join('')+'<table border="1"><tr><th>Item</th><th>Amount</th></tr><tr><td>Ticket</td><td>1,250 EGP</td></tr><tr><td>Fee</td><td>50 EGP</td></tr></table><p><img src="'+img+'" alt="logo"></p><p><b>Bold end</b></p>';
 R.clip=await pg.evaluate(async h=>{try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([h],{type:'text/html'}),'text/plain':new Blob(['QA MAN pasted plain'],{type:'text/plain'})})]);return 'ok';}catch(e){return String(e);}},html);
 await pg.keyboard.press('Control+V');await pg.waitForTimeout(2500);
 R.pasted=await ed.evaluate(e=>({len:e.innerText.length,tables:e.querySelectorAll('table').length,imgs:e.querySelectorAll('img').length,heads:e.querySelectorAll('h1,h2,h3').length,bold:e.querySelectorAll('b,strong').length,paras:e.querySelectorAll('p').length}));await L.shot('t06-06-pasted');
 R.longSend=await send();R.longAt=new Date().toISOString();await pg.waitForTimeout(6000);await L.shot('t06-06-sent');
 const reps=((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data||[];R.replies=reps.map(x=>x.direction+' '+(x.status||'')+' '+String(x.created_at||'').slice(11,19)+' '+(x.subject||'')+' to='+JSON.stringify(x.to||x.to_addresses||'').slice(0,70));
 await W(45000);for(const b of ['M1','M2']){const ib=await L.inbox(b);R[b]=[];for(const m of ib.list.slice(0,6)){const full=await ib.read(m.id);const h=String(full.html||'');R[b].push({at:m.at,from:m.from,subject:m.subject,hasTable:/<table/i.test(h),hasImg:/<img/i.test(h),bold:/<(b|strong)>/i.test(h),fwdNote:/forward note/.test(full.text||''),orig:/Customer question about a refund/.test(full.text||''),len:(full.text||'').length});}}
 }catch(e){R.err=String(e.message).slice(0,120);await L.shot("t06-err");}return R;};
