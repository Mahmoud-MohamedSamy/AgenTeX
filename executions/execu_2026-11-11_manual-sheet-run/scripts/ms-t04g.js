const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();
 R.keys=await L.fieldKeys();R.deptOpts=await L.optsF('department');R.d=await L.pickF('department','Marketing');await pg.waitForTimeout(4000);
 R.layoutNow=await pg.evaluate(()=>{const s=document.querySelector('select');return s?s.options[s.selectedIndex].text:null;});R.keys2=await L.fieldKeys();await L.shot('t04-05-mk');
 R.d2=await L.pickF('department','Tech');await pg.waitForTimeout(4000);R.layoutTech=await pg.evaluate(()=>{const s=document.querySelector('select');return s?s.options[s.selectedIndex].text:null;});R.keys3=await L.fieldKeys();
 return R;};
