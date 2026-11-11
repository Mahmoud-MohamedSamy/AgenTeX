// T-06-05 finish: check the last reply mail in M1 and the composer once more; remove the Marketing signature.
const L=require('./lib');
module.exports=async()=>{const R={};try{const id=JSON.parse(require('fs').readFileSync(OUT+'/t06-id.json')).id;
 const toast=async()=>{let s='';for(let i=0;i<15&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 R.sigApi=(await api('GET','/mail/signatures/me')).t.slice(0,400);
 const reps=((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data||[];R.replies=reps.map(x=>x.direction+' '+String(x.created_at||'').slice(11,19)+' '+(x.subject||''));
 const ib=await L.inbox('M1');R.m1=[];for(const m of ib.list.slice(0,3)){const f=(await ib.read(m.id))||{};const h=String(f.html||'');R.m1.push({at:m.at,subject:m.subject,withSigText:/QA MAN reply with signature/.test(h),sigCount:(h.match(/QA MAN Signature Line/g)||[]).length,arabicSig:/مع التحية/.test(h),company:(h.match(/Wonder Travel/g)||[]).length,rtl:/dir="?rtl|direction:\s*rtl/i.test(h),sigAfterText:h.indexOf('QA MAN Signature Line')>h.indexOf('QA MAN reply with signature')});}
 R.step="composer";
 await L.gotoTicket(id);await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await pg.waitForTimeout(5000);const re=pg.locator('[contenteditable=true][aria-label="Reply body"]').last();
 R.composer=await re.evaluate(e=>{const t=e.innerText;const n=[...e.querySelectorAll('*')].find(x=>[...x.childNodes].some(c=>c.nodeType===3&&c.textContent.includes('مع التحية')));return {sig:(t.match(/QA MAN Signature Line/g)||[]).length,arabic:(t.match(/مع التحية/g)||[]).length,sigIdx:t.indexOf('QA MAN Signature Line'),quoteIdx:t.indexOf(' wrote:'),arDir:n?getComputedStyle(n).direction:null};});await L.shot('t06-05-composer');
 await pg.getByRole('button',{name:/^Cancel$/}).last().click().catch(()=>{});
 R.step="remove";
 await pg.goto(H+'/profile',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Landing page/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);await pg.getByRole('tab',{name:/Signatures/i}).click();await pg.waitForTimeout(4000);
 const sel=pg.locator('select').first();const lab=(await sel.evaluate(s=>[...s.options].map(o=>o.text))).find(t=>t.startsWith('Marketing'));await sel.selectOption({label:lab});await pg.waitForTimeout(2500);
 R.btns=await pg.evaluate(()=>[...document.querySelectorAll('main button')].map(b=>(b.getAttribute('aria-label')||b.innerText).trim()).filter(Boolean).slice(-12));
 const del=pg.getByRole('button',{name:/delete|remove/i}).first();if(await del.count()){await del.click();await pg.waitForTimeout(1500);const cf=pg.locator('[role=dialog],[role=alertdialog]').getByRole('button',{name:/delete|remove|confirm/i}).last();if(await cf.count())await cf.click();R.removeToast=await toast();}
 else{const ed=pg.locator('[contenteditable=true]').last();await ed.click();await pg.keyboard.press('Control+A');await pg.keyboard.press('Delete');await pg.getByRole('button',{name:/^Save signature$/}).click();R.clearToast=await toast();}
 await pg.waitForTimeout(2000);R.final=(await api('GET','/mail/signatures/me')).t.slice(0,300);LED('T-06-05 Marketing signature removal: '+R.final.slice(0,120));}catch(e){R.err=String(e.message).slice(0,100);await L.shot("t06-05-err");}return R;};
