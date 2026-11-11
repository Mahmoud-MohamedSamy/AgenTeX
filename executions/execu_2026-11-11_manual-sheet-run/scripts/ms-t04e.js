const L=require('./lib');
module.exports=async()=>{const R={};await L.gotoNew();await pg.waitForFunction(()=>/Subject/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(2000);
 const cb=pg.locator(`xpath=//*[normalize-space(translate(text(),'*',''))="Department"]/ancestor::*[.//button[@role="combobox"]][1]//button[@role="combobox"]`).first();
 R.cbText=await cb.innerText();await cb.click();await pg.waitForTimeout(3000);await L.shot('t04-0-deptpicker');
 R.popup=await pg.evaluate(()=>{const p=document.querySelector('[data-radix-popper-content-wrapper],[role=dialog],[role=listbox]');return p?p.outerHTML.replace(/class="[^"]*"/g,'').slice(0,2500):'none';});
 await pg.keyboard.type('Mark');await pg.waitForTimeout(3000);R.after=await pg.evaluate(()=>{const p=document.querySelector('[data-radix-popper-content-wrapper],[role=dialog],[role=listbox]');return p?p.innerText.slice(0,600):'none';});
 await L.shot('t04-0-deptpicker2');return R;};
