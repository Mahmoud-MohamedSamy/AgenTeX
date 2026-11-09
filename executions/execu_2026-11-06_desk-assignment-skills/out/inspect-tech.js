const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({channel:'msedge'});const p=await b.newPage({viewport:{width:900,height:1400}});
await p.goto('https://staging-crm.taviportal.com/embed/feedback/index.html?key=fw1.a7a7a7a7000000000000000000000004.fQ_pa7EiH9UYXmzyT9drANidVpX5goeEBGREfrRnf8U&mode=frame');
for(let i=0;i<30;i++){await p.waitForTimeout(1500);if(await p.locator('button:has-text("Send")').count())break;}
const d=await p.$$eval('form label',ls=>ls.map(l=>{const id=l.htmlFor;const el=id?document.getElementById(id):null;return {label:l.innerText.trim(),for:id,tag:el&&el.tagName,type:el&&el.type,multiple:el&&el.multiple,opts:el&&el.tagName==='SELECT'?[...el.options].slice(0,4).map(o=>o.value+'='+o.text):null,role:el&&el.getAttribute('role')};}));
const extra=await p.$$eval('form [role=listbox],form [role=combobox],form input[type=checkbox],form input[type=file]',e=>e.map(x=>x.tagName+'|'+x.type+'|'+(x.getAttribute('role')||'')+'|'+(x.name||'')+'|'+(x.id||'')).slice(0,40));
console.log(JSON.stringify({d,extra},null,1));await p.screenshot({path:path.resolve(__dirname,'../screenshots/ev-tech-webform.png'),fullPage:true});await b.close();})();
