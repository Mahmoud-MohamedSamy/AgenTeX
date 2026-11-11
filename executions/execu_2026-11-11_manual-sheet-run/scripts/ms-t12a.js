const L=require('./lib');const MI='95a6fd64-b877-435e-8e23-62c75717f95f';
module.exports=async()=>{const R={};let t=(await L.findTicket('QA MAN assign 01'))[0];
 if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN assign 01',department:MI,status:'Open'}));t={id:c.j.data.id};LED('T-12 ticket "QA MAN assign 01" (Manual Invoice) '+t.id);}
 R.unassign=(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:null,team_id:null})).s;R.id=t.id;require('fs').writeFileSync(OUT+'/t12-id.json',JSON.stringify({id:t.id}));
 R.teams=(await api('GET','/desk/departments/'+MI+'/teams')).t.slice(0,300);
 await L.gotoTicket(t.id);R.key=(await L.body_txt()).match(/Key Information.{0,200}/)?.[0];
 const own=pg.getByText('Ticket Owner',{exact:true}).first();await own.locator('xpath=..').click().catch(()=>{});await pg.waitForTimeout(2500);
 R.picker=(await pg.evaluate(()=>{const p=document.querySelector('[role=dialog],[role=listbox],[data-radix-popper-content-wrapper]');return p?p.innerText.replace(/\s+/g,' ').slice(0,600):null;}));await L.shot('t12-0-picker');
 R.pickup=await pg.getByRole('button',{name:/pick ?up/i}).count();return R;};
