const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();
 const sels=async()=>pg.evaluate(()=>[...document.querySelectorAll('select')].map(s=>(s.getAttribute('aria-label')||s.id||'')+': '+[...s.options].map(o=>o.text+(o.selected?'*':'')).join(' | ')));
 R.def=await sels();await L.pickF('department','Marketing');await pg.waitForTimeout(2500);R.mk=await sels();R.mkCombos=await pg.evaluate(()=>[...document.querySelectorAll('[role=combobox],button[aria-haspopup]')].map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().slice(0,40)).slice(0,15));
 await L.pickF('department','Customer Support');await pg.waitForTimeout(2500);R.cs=await sels();R.csTop=(await L.body_txt()).match(/Create Ticket.{0,200}/)?.[0];await L.shot('t04-06-cs');return R;};
