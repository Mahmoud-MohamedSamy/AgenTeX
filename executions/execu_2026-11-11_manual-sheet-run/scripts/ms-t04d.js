// T-04-01 phone ticket from the screen (Marketing) + T-04-10 side effects + T-04-07 reload persistence (part).
const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();await pg.waitForFunction(()=>/Subject/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(2000);
 R.deptOpts=await L.comboOptions('Department');
 R.dept=await L.pick('Department','Marketing');await pg.waitForTimeout(3000);
 R.contact=await L.pick('Contact','QA MAN Contact 1');
 await pg.locator('input[type=text][role=combobox]').first().fill('QA MAN phone 01');
 await pg.locator('textarea').first().fill('Caller asks about refund');
 R.channel=await L.pick('Channel','Phone');R.status=await L.pick('Status','Open');
 R.statusAfter=(await L.body_txt()).match(/Status .{0,30}/)?.[0];
 await L.shot('t04-01-form');
 await pg.getByRole('button',{name:/^Save$/}).click();await pg.waitForTimeout(8000);
 R.urlAfter=pg.url();R.toast=(await L.body_txt()).match(/(success|created|saved|permission denied|error)[^.]{0,80}/ig);
 await L.shot('t04-01-after');
 const f=await L.findTicket('QA MAN phone 01');R.found=f.map(o=>({id:o.id,no:o.ticket_number,dept:o.department,channel:o.channel,status:o.status,priority:o.priority,contact:o.contact_id}));
 if(f[0]){LED('T-04-01 ticket "QA MAN phone 01" '+f[0].id+' #'+f[0].ticket_number);
  await W(20000);const a=((await api('GET','/desk/tickets/'+f[0].id+'/activity')).j||{}).data;R.activity=(Array.isArray(a)?a:[]).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,120));
  const rec=fl((await api('GET','/modules/'+T+'/records/'+f[0].id)).j.data);R.tags=rec.tags;
  await L.gotoTicket(f[0].id);await pg.reload({waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(4000);
  R.afterReload=(await L.body_txt()).match(/(QA MAN phone 01|Phone|Marketing|Caller asks about refund)/g);await L.shot('t04-07-reload');}
 return R;};
