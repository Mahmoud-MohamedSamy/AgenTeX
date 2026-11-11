// T-06-05: owner signature for Marketing only (English + Arabic line), reply on the Marketing ticket, check composer + M1; then remove the signature.
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 const toast=async()=>{let s='';for(let i=0;i<15&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 R.before=(await api('GET','/mail/signatures/me')).t.slice(0,300);
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/profile',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Landing page/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);
 await pg.getByRole('tab',{name:/Signatures/i}).click();await pg.waitForTimeout(4000);
 const sel=pg.locator('select').filter({has:pg.locator('option',{hasText:'All departments'})}).first();R.deptOpts=(await sel.evaluate(s=>[...s.options].map(o=>o.text))).slice(0,8);await sel.selectOption({label:'Marketing'});await pg.waitForTimeout(2500);
 const ed=pg.locator('[contenteditable=true]').last();await ed.click();await pg.keyboard.type('QA MAN Signature Line');await pg.keyboard.press('Enter');await pg.keyboard.type('مع التحية - فريق الدعم');await pg.waitForTimeout(800);
 await pg.getByRole('button',{name:/^Save signature$/}).click();R.saveToast=await toast();await pg.waitForTimeout(2000);await L.shot('t06-05-sig-saved');LED('T-06-05 owner signature for Marketing set (to remove)');
 R.after=(await api('GET','/mail/signatures/me')).t.slice(0,500);
 // reply
 await L.gotoTicket(id);await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await pg.waitForTimeout(5000);const re=pg.locator('[contenteditable=true][aria-label="Reply body"]').last();
 R.composerHasSig=await re.evaluate(e=>{const t=e.innerText;return {count:(t.match(/QA MAN Signature Line/g)||[]).length,arabic:(t.match(/مع التحية/g)||[]).length};});
 await re.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN reply with signature');await pg.waitForTimeout(800);
 R.order=await re.evaluate(e=>{const t=e.innerText;return {reply:t.indexOf('QA MAN reply with signature'),sig:t.indexOf('QA MAN Signature Line'),quote:t.indexOf(' wrote:')};});
 R.sigDir=await re.evaluate(e=>{const n=[...e.querySelectorAll('*')].find(x=>x.childNodes.length&&[...x.childNodes].some(c=>c.nodeType===3&&c.textContent.includes('مع التحية')));return n?getComputedStyle(n).direction+' align='+getComputedStyle(n).textAlign+' dir='+n.getAttribute('dir'):'not in composer';});
 await L.shot('t06-05-composer');
 let b=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const x=c.nth(i);if(await x.isVisible().catch(()=>false)&&!(await x.isDisabled().catch(()=>true)))b=x;}
 if(b){await b.click();R.send=await toast();}else R.send='Send disabled';
 await W(40000);const ib=await L.inbox('M1');const m=ib.list.find(x=>x.at>new Date(Date.now()-120000).toISOString().slice(0,19));
 if(m){const f=await ib.read(m.id);const h=String(f.html||'');R.mail={subject:m.subject,sigCount:(h.match(/QA MAN Signature Line/g)||[]).length,companySig:(h.match(/Wonder Travel/g)||[]).length,arabic:/مع التحية/.test(h),rtlMarkup:/dir="?rtl|direction:\s*rtl/i.test(h)};}
 // remove signature
 await pg.goto(H+'/profile',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Landing page/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);await pg.getByRole('tab',{name:/Signatures/i}).click();await pg.waitForTimeout(4000);
 await pg.locator('select').filter({has:pg.locator('option',{hasText:'All departments'})}).first().selectOption({label:'Marketing'});await pg.waitForTimeout(2500);
 R.removeBtns=await pg.evaluate(()=>[...document.querySelectorAll('main button')].map(b=>(b.getAttribute('aria-label')||b.innerText).trim()).filter(t=>/delete|remove|clear/i.test(t)));
 const del=pg.getByRole('button',{name:/delete|remove/i}).first();if(await del.count()){await del.click();await pg.waitForTimeout(1500);const cf=pg.getByRole('button',{name:/^(Delete|Remove|Confirm)$/}).last();if(await cf.count())await cf.click();R.removeToast=await toast();}
 R.final=(await api('GET','/mail/signatures/me')).t.slice(0,300);return R;};
