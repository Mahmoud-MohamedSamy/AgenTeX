// T-04-06: create "QA MAN template" (Marketing: subject + priority Low), pick it on Create Ticket, save, check values.
const L=require('./lib');
module.exports=async()=>{const R={};
 const c=await api('POST','/desk/ticket-templates',{name:'QA MAN template',department_id:L.D.MK,field_values:{subject:'QA MAN from template',priority:'low'}});R.create=c.s+' '+c.t.slice(0,200);
 const id=c.j&&c.j.data&&(c.j.data.id||(c.j.data.template&&c.j.data.template.id));if(id)LED('T-04-06 template "QA MAN template" '+id);R.tid=id;
 await L.gotoNew();await L.pickF('department','Marketing');await pg.waitForTimeout(2500);
 await pg.waitForFunction(()=>[...document.querySelectorAll('select option')].some(o=>o.text.startsWith('QA MAN template')),null,{timeout:30000}).catch(()=>{});const sel=pg.locator('select').filter({has:pg.locator('option',{hasText:'Use template'})}).first();R.opts=await sel.evaluate(s=>[...s.options].map(o=>o.text));
 const label=R.opts.find(o=>o.startsWith('QA MAN template'));if(!label)return R;await sel.selectOption({label});await pg.waitForTimeout(2500);
 R.filled=await pg.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-rule-field]')].map(e=>[e.getAttribute('data-rule-field'),(e.querySelector('input')?.value||e.innerText).replace(/\s+/g,' ').trim().slice(0,50)])));await L.shot('t04-06-filled');
 if(/Select/.test(R.filled.status||''))await L.pickF('status','Open');
 const resp=[];pg.on('response',r=>{if(r.request().method()==='POST'&&/records/.test(r.url()))resp.push(r.status()+' '+r.url().slice(-60));});await pg.getByRole('button',{name:/^Save$/}).click();for(let i=0;i<30&&pg.url().includes('records/new');i++)await pg.waitForTimeout(1000);R.resp=resp;R.toast=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText).join(' | '));R.urlAfter=pg.url();await L.shot('t04-06-saved');
 const m=pg.url().match(/tickets\/([0-9a-f-]{36})/);if(m){const o=fl((await api('GET','/modules/'+T+'/records/'+m[1])).j.data);R.saved={id:o.id,no:o.ticket_number,subject:o.subject,priority:o.priority,dept:o.department===L.D.MK};LED('T-04-06 ticket from template '+o.id);}
 return R;};
