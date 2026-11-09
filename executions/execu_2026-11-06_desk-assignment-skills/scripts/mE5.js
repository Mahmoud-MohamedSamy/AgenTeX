eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;
const SS=JSON.stringify(g.snippets);o.snipKeys=Object.keys(g.snippets||{}).join(',');
const q=String.fromCharCode(34), bs=String.fromCharCode(92);
const ix=SS.indexOf('index.html');let U=null;
if(ix>0){const st=SS.lastIndexOf('https://',ix);const en=SS.indexOf(q,ix);U=SS.slice(st,en).split(bs).join('').split('&amp;').join('&');}
o.iframe=U?U.split('?')[0]:null;
if(U){const ctx2=await page.context().browser().newContext({viewport:{width:900,height:1000}});const p=await ctx2.newPage();const net=[];
p.on('response',r=>{if(r.url().indexOf('web-forms')>0)net.push(r.status()+' '+r.request().method()+' '+r.url().split('/').slice(-1)[0].slice(0,30));});
await p.goto(U,{waitUntil:'commit',timeout:180000});for(let i=0;i<30;i++){await p.waitForTimeout(2000);if(await p.locator('input').count()>=2)break;}
o.els=await p.$$eval('input,textarea,button',e=>e.map(x=>x.tagName+'|'+(x.name||'')+'|'+(x.type||'')+'|'+(x.id||'')+'|'+(x.innerText||x.placeholder||'').slice(0,30)));
o.labels=await p.$$eval('label',e=>e.map(x=>x.innerText.trim()+'>'+(x.htmlFor||'')));o.net=net;o.text=(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
await p.screenshot({path:'../screenshots/ev-D14-webform-public.png'});await ctx2.close();}
return o;
