// T-05-06 two editors (Owner + Admin B), T-05-09 Arabic detail + keyboard focus order.
const L=require('./lib');const path=require('path');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/ms-t05a.json')).id;
 const toast=async p=>{let t='';for(let i=0;i<12&&!t;i++){await p.waitForTimeout(400);t=await p.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return t;};
 const setPri=async(p,val)=>{await p.getByRole('button',{name:'Edit Priority'}).click();await p.waitForTimeout(1200);const ps=p.locator('[data-rule-field="priority"] button[role=combobox], [data-rule-field="priority"] button[aria-haspopup]').first();if(await ps.count())await ps.click();else await p.getByText(/^(Select|Low|Medium|High)$/).last().click();await p.waitForTimeout(1000);
  await p.locator('[role=option]').filter({hasText:new RegExp('^\\s*'+val+'\\s*$')}).first().click().catch(()=>{});await p.waitForTimeout(500);await p.getByRole('button',{name:/^Save$/}).last().click();return toast(p);};
 // owner opens first
 await L.gotoTicket(id);
 const b=pg.context().browser();const ctxB=await b.newContext({storageState:path.join(OUT,'adminb.json')});const pB=await ctxB.newPage();await pB.setViewportSize({width:1600,height:1000});
 await pB.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'}).catch(()=>{});const okB=await pB.waitForFunction(()=>/Ticket Owner|not available/.test(document.body.innerText),null,{timeout:120000}).then(()=>true).catch(()=>false);await pB.waitForTimeout(4000);
 R.bOpen=okB&&!/not available/.test(await pB.innerText('body'));
 if(R.bOpen){R.bToast=await setPri(pB,'Medium');await pB.waitForTimeout(2000);R.ownerSeesBefore=(await L.body_txt()).match(/Priority (Low|Medium)/)?.[0];
  R.oToast=await setPri(pg,'Low');await pg.waitForTimeout(3000);await L.shot('t05-06-owner-second');
  const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);R.final=o.priority;
  const ht=pg.locator('[role=tab]').filter({hasText:/history/i}).first();await ht.click();await pg.waitForTimeout(4000);const ctl=await ht.getAttribute('aria-controls');R.hist=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,500),ctl);await L.shot('t05-06-history');}
 await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t05-06-adminb.png')});await ctxB.storageState({path:path.join(OUT,'adminb.json')}).catch(()=>{});await ctxB.close();
 // 09 Arabic
 const lang=pg.getByRole('button',{name:/^EN$/}).first();if(await lang.count()){await lang.click();await pg.waitForTimeout(1500);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'العربية'}).first().click();await pg.waitForTimeout(5000);
  await L.gotoTicket(id);const t=await L.body_txt();R.ar={dir:await pg.evaluate(()=>document.documentElement.dir),english:[...new Set(t.match(/\b(Ticket Properties|Contact Info|Key Information|Ticket Owner|Due Date|Reply All|Close ticket|Start timer|Conversation|History|Priority|Channel|Created Time|Modified By|Approval Status)\b/gi)||[])],sample:t.replace(/^.*?(QA MAN phone 01 edited)/,'$1').slice(0,500)};await L.shot('t05-09-ar');
  const head=pg.locator('main').getByText('QA MAN phone 01 edited').last();await head.click().catch(()=>{});await pg.keyboard.press('Escape');
  const foc=[];for(let i=0;i<10;i++){await pg.keyboard.press('Tab');foc.push(await pg.evaluate(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y)+' '+(a.getAttribute('aria-label')||a.innerText||a.tagName).trim().slice(0,25);}));}R.focus=foc;
  const back=pg.getByRole('button',{name:/^AR$/}).first();if(await back.count()){await back.click();await pg.waitForTimeout(1200);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'English'}).first().click();await pg.waitForTimeout(4000);R.backEN=true;}}
 return R;};
