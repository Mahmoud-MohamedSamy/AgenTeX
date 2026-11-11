// T-06-10 Arabic reply, T-06-06 long pasted reply (table + image), T-06-03 forward to M2, T-06-08 reload order. Then mailbox checks.
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;const no=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).ticket_number;R.no=no;
 const m2=require('fs').existsSync('x')?'':JSON.parse(require('fs').readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/ms-mailboxes.json')).M2.address;
 const toast=async()=>{let s='';for(let i=0;i<15&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const send=async()=>{let b=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const x=c.nth(i);if(await x.isVisible().catch(()=>false)&&!(await x.isDisabled().catch(()=>true)))b=x;}if(!b)return 'Send disabled';await b.click();return toast();};
 const open=async()=>{await L.gotoTicket(id);await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await pg.waitForTimeout(4000);return pg.locator('[contenteditable=true][aria-label="Reply body"]').last();};
 // 10 Arabic
 let ed=await open();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('مرحبا، هذا رد تجريبي QA MAN باللغة العربية');await pg.waitForTimeout(800);
 R.arDir=await ed.evaluate(e=>{const p=e.querySelector('p,div')||e;return {editor:getComputedStyle(e).direction,para:getComputedStyle(p).direction,paraDir:p.getAttribute('dir'),align:getComputedStyle(p).textAlign};});
 await L.shot('t06-10-ar-composer');R.arSend=await send();R.arAt=new Date().toISOString();await pg.waitForTimeout(5000);
 // 06 long paste
 ed=await open();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');
 const para='QA MAN long reply paragraph. '+'Lorem refund policy text for the customer, line repeated to make a long page. '.repeat(12);
 const img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIklEQVR42mNkYGD4z0ABYBzVMKoBRgFGNYxqGFUwqgEAWX4D/1WeYQ8AAAAASUVORK5CYII=';
 const html='<h2>QA MAN pasted from Word</h2>'+Array.from({length:9},()=>'<p>'+para+'</p>').join('')+'<table border="1"><tr><th>Item</th><th>Amount</th></tr><tr><td>Ticket</td><td>1,250 EGP</td></tr><tr><td>Fee</td><td>50 EGP</td></tr></table><p><img src="'+img+'" alt="logo"></p><p><b>Bold end</b></p>';
 await ed.evaluate((e,h)=>{const dt=new DataTransfer();dt.setData('text/html',h);dt.setData('text/plain','QA MAN pasted');e.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));},html);await pg.waitForTimeout(2000);
 R.pasted=await ed.evaluate(e=>({len:e.innerText.length,tables:e.querySelectorAll('table').length,imgs:e.querySelectorAll('img').length,h2:e.querySelectorAll('h2,h1,h3').length,bold:e.querySelectorAll('b,strong').length}));await L.shot('t06-06-pasted');
 R.longSend=await send();R.longAt=new Date().toISOString();await pg.waitForTimeout(5000);
 // 03 forward
 await L.gotoTicket(id);const more=pg.getByRole('button',{name:'More ways to reply'}).first();await more.click();await pg.waitForTimeout(1200);R.menu=await pg.locator('[role=menuitem]').allInnerTexts();
 const fw=pg.getByRole('menuitem',{name:/forward/i}).first();if(await fw.count()){await fw.click();await pg.waitForTimeout(4000);
  const to=pg.locator('input[placeholder="Add an email address"], input[aria-label="Recipients"]').first();await to.fill(m2);await pg.keyboard.press('Enter');await pg.waitForTimeout(800);
  const fe=pg.locator('[contenteditable=true]').last();await fe.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN forward note for M2');
  R.fwdComposer=(await L.body_txt()).match(/(Forward|Fwd)[^.]{0,150}/i)?.[0];await L.shot('t06-03-fwd-composer');R.fwdSend=await send();R.fwdAt=new Date().toISOString();await pg.waitForTimeout(5000);}
 // 08 reload: thread order
 await L.gotoTicket(id);await pg.reload({waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(6000);
 const tab=pg.locator('[role=tab]').filter({hasText:/conversation/i}).first();const ctl=await tab.getAttribute('aria-controls');R.thread=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,1500),ctl);await L.shot('t06-08-thread');
 const reps=((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data||[];R.replies=reps.map(x=>x.direction+' '+(x.status||'')+' '+String(x.created_at||'').slice(11,19)+' '+(x.subject||'')+' to='+JSON.stringify(x.to||x.to_addresses||'').slice(0,60));
 // mailboxes
 await W(45000);for(const b of ['M1','M2']){const ib=await L.inbox(b);R[b]=[];for(const m of ib.list.slice(0,6)){const full=await ib.read(m.id);R[b].push({at:m.at,from:m.from,subject:m.subject,arabicOK:/مرحبا/.test(full.text||'')||/مرحبا/.test(String(full.html||'')),q:/\?\?\?\?/.test(full.text||''),hasTable:/<table/i.test(String(full.html||'')),hasImg:/<img/i.test(String(full.html||'')),fwdNote:/forward note/.test(full.text||''),orig:/Customer question about a refund/.test(full.text||''),len:(full.text||'').length});}}
 return R;};
