// Agent C (Customer Experience Specialists 2, Desk Agent): T-04-02 chat ticket in Customer Support, T-04-08 department list + Marketing save attempt.
const L=require('./lib');
module.exports=async()=>{const R={};
 await L.gotoNew();R.deptOpts=await L.optsF('department');R.deptDefault=(await pg.locator('[data-rule-field="department"]').innerText()).replace(/\s+/g,' ');await L.shot('t04-08-agent-depts');
 // 02
 R.d=await L.pickF('department','Customer Support');R.c=await L.pickF('contact_id','QA MAN Contact 1');await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN chat 01');
 R.ch=await L.pickF('channel','Chat');R.st=await L.pickF('status','Open');
 await pg.getByRole('button',{name:/^Save$/}).click();for(let i=0;i<30&&pg.url().includes('records/new');i++)await pg.waitForTimeout(1000);R.url2=pg.url();
 R.toast2=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText).join(' | '));await pg.waitForTimeout(4000);await L.shot('t04-02-agent-chat');
 const m=pg.url().match(/tickets\/([0-9a-f-]{36})/);if(m){const o=fl((await api('GET','/modules/'+T+'/records/'+m[1])).j.data);R.t02={id:o.id,no:o.ticket_number,channel:o.channel,dept:o.department===L.D.CS,owner:o.owner&&(o.owner.name||o.owner.id||o.owner)};LED('T-04-02 Agent C ticket "QA MAN chat 01" '+o.id);
  R.t02open=/QA MAN chat 01/.test(await L.body_txt());}
 // 08: try Marketing in the form, then by API
 await L.gotoNew();R.mk=await L.pickF('department','Marketing');
 if(R.mk==='ok'){await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN agent into Marketing');await L.pickF('status','Open');await pg.getByRole('button',{name:/^Save$/}).click();for(let i=0;i<20&&pg.url().includes('records/new');i++)await pg.waitForTimeout(1000);R.mkUrl=pg.url();R.mkToast=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText).join(' | '));await L.shot('t04-08-agent-mk-save');}
 const a=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN agent API Marketing',department:L.D.MK,status:'Open'}));R.apiMk=a.s+' '+a.t.slice(0,200);
 const made=a.j&&a.j.data&&a.j.data.id;if(made)LED('T-04-08 Agent C API ticket in Marketing '+made);
 return R;};
