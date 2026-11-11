// T-06-02 Reply All with CC (M2) and BCC (M3) on a ticket made in Desk.
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;const m3=await L.mailbox('M3');
 const bx=JSON.parse(require('fs').readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/ms-mailboxes.json'));const m2=bx.M2.address;
 const toast=async()=>{let s='';for(let i=0;i<15&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 await L.gotoTicket(id);await pg.getByRole('button',{name:/^Reply All$/}).first().click();await pg.waitForTimeout(5000);
 R.prefill=(await L.body_txt()).match(/Recipients .{0,160}?Subject/)?.[0];
 if(!/M2|qa-man-m2/.test(R.prefill||'')){await pg.getByRole('button',{name:/^Cc$/}).click();await pg.waitForTimeout(600);await pg.keyboard.type(m2);await pg.keyboard.press('Enter');}
 await pg.getByRole('button',{name:/^Bcc$/}).click();await pg.waitForTimeout(800);R.bccIn=await pg.locator('input[placeholder="Bcc"]').count();await pg.locator('input[placeholder="Bcc"]').first().fill(m3);await pg.keyboard.press('Enter');await pg.waitForTimeout(800);
 R.fields=(await L.body_txt()).match(/Recipients .{0,260}?Subject/)?.[0]?.replace(/qa-man-(m\d)-[a-z0-9]+@fldubai\.com/g,'$1');
 const ed=pg.locator('[contenteditable=true][aria-label="Reply body"]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN reply all CC BCC 2');
 await L.shot('t06-02-composer');let b=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const x=c.nth(i);if(await x.isVisible().catch(()=>false)&&!(await x.isDisabled().catch(()=>true)))b=x;}
 R.send=b?(await b.click(),await toast()):'Send disabled';await pg.waitForTimeout(5000);
 const tab=pg.locator('[role=tab]').filter({hasText:/conversation/i}).first();const ctl=await tab.getAttribute('aria-controls').catch(()=>null);R.thread=ctl?(await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,400),ctl)).replace(/qa-man-(m\d)-[a-z0-9]+@fldubai\.com/g,'$1'):null;await L.shot('t06-02-thread');
 await W(40000);const since=new Date(Date.now()-120000).toISOString().slice(0,19);
 for(const k of ['M1','M2','M3']){const ib=await L.inbox(k);const m=ib.list.find(x=>x.at>since&&/QA MAN reply 01/.test(x.subject||''));if(!m){R[k]='not received';continue;}const f=(await ib.read(m.id))||{};const hd=JSON.stringify({to:f.to,cc:f.cc,bcc:f.bcc}).replace(/qa-man-(m\d)-[a-z0-9]+@fldubai\.com/g,'$1');R[k]={subject:m.subject,headers:hd,body:/reply all with CC and BCC/.test(String(f.html||''))};}
 return R;};
