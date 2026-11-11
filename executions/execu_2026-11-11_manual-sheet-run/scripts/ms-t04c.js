const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();
 await pg.waitForFunction(()=>/Subject/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(3000);
 R.layoutSel=await pg.evaluate(()=>{const s=document.querySelector('select');return s?[...s.options].map(o=>o.text+(o.selected?'*':'')):null;});
 R.text=(await L.body_txt()).replace(/^.*Save and New Save/,'').slice(0,2500);
 R.inputs=await pg.evaluate(()=>[...document.querySelectorAll('main input,main textarea,main select,main [role=combobox],main [contenteditable=true]')].map(e=>{const id=e.id;const lab=id&&document.querySelector('label[for="'+id+'"]');return (lab?lab.innerText.trim():(e.getAttribute('aria-label')||e.name||e.placeholder||''))+' <'+e.tagName.toLowerCase()+(e.type?':'+e.type:'')+(e.getAttribute('role')?' role='+e.getAttribute('role'):'')+'>';}));
 await L.shot('t04-0-form');return R;};
