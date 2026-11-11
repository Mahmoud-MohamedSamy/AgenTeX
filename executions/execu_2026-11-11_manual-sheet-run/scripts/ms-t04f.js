const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();await pg.waitForFunction(()=>/Subject/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(2000);
 R.html=await pg.evaluate(()=>{const el=[...document.querySelectorAll('main *')].find(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()==='Department'));let a=el;for(let i=0;i<3;i++)a=a.parentElement;return a.outerHTML.replace(/class="[^"]*"/g,'').replace(/<svg.*?<\/svg>/g,'<svg/>').slice(0,1800);});return R;};
