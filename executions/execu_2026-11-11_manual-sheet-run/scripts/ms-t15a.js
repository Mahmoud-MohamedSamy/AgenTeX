// T-15 owner side: ticket "QA MAN share 01" (Marketing, contact M1); open Share dialog (levels), share CS read-only via UI; Arabic dialog. MODE=full|restricted|none|readonly sets the share via API.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 let t=(await L.findTicket('QA MAN share 01'))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN share 01',department:L.D.MK,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'QA MAN share test'}));t={id:c.j.data.id};LED('T-15 ticket "QA MAN share 01" '+t.id);}
 const id=t.id;require('fs').writeFileSync(OUT+'/t15.json',JSON.stringify({id}));
 if(process.env.MODE){const m=process.env.MODE;const body=m==='none'?{shares:[]}:{shares:[{department_id:L.D.CS,access:m==='readonly'?'read_only':m}]};const r=await api('PUT','/desk/tickets/'+id+'/shares',body);R.set=m+' '+r.s+' '+r.t.slice(0,200);return R;}
 try{
 step='dialog';await L.gotoTicket(id);await pg.getByRole('button',{name:'More ticket actions'}).first().click();await pg.waitForTimeout(1000);await pg.getByRole('menuitem',{name:/^Share/i}).first().click();await pg.waitForTimeout(2500);
 const d=pg.locator('[role=dialog]').last();R.dialog=(await d.innerText()).replace(/\s+/g,' ').slice(0,600);R.ctl=await d.evaluate(x=>[...x.querySelectorAll('button,select,input,[role=radio],[role=combobox]')].map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText||e.value||e.tagName).trim().slice(0,30)));await L.shot('t15-0-dialog');
 await d.getByRole("button",{name:"Add department"}).first().click();await pg.waitForTimeout(1200);
 await d.locator("button").filter({hasText:/^s*Choose a departments*$/}).first().click();await pg.waitForTimeout(1200);const dopts=(await pg.locator("[role=option]").allInnerTexts()).map(x=>x.trim());R.deptCount=dopts.length;R.offersOwn=dopts.includes("Marketing");
 await pg.locator("[role=option]").filter({hasText:/^s*Customer Supports*$/}).first().click();await pg.waitForTimeout(1000);
 await d.locator("button").filter({hasText:/^s*Full Accesss*$/}).first().click();await pg.waitForTimeout(1000);R.levelOpts=(await pg.locator("[role=option]").allInnerTexts()).map(x=>x.replace(/s+/g," ").trim());await L.shot("t15-0-levels");
 const ro=pg.locator("[role=option]").filter({hasText:/Read/i}).first();if(await ro.count())await ro.click();await pg.waitForTimeout(800);R.dialog2=(await d.innerText()).replace(/s+/g," ").slice(0,400);
 await d.getByRole("button",{name:/^Save$/}).last().click();R.saveToast=await toast();await pg.waitForTimeout(2500);
 R.shares=(await api('GET','/desk/tickets/'+id+'/shares')).t.slice(0,250);R.banner=(await L.body_txt()).match(/Shared with[^.]{0,80}/)?.[0];
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);await L.shot('t15-err');}return R;};
