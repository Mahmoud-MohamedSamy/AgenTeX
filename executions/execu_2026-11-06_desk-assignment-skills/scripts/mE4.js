eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const URL=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data.share_url;o.host=URL.split('/').slice(0,4).join('/');
const ctx2=await page.context().browser().newContext({viewport:{width:900,height:1000}});const p=await ctx2.newPage();
await p.goto(URL,{waitUntil:'commit',timeout:180000});for(let i=0;i<40;i++){await p.waitForTimeout(2000);if(await p.locator('input').count()>=2)break;}
o.frames=p.frames().map(f=>f.url().split('?')[0]);
for(const f of p.frames()){const els=await f.$$eval('input,textarea,button,select',e=>e.map(x=>x.tagName+'|'+(x.name||'')+'|'+(x.type||'')+'|'+(x.getAttribute('aria-label')||'')+'|'+(x.id||'')+'|'+(x.innerText||x.placeholder||'').slice(0,30))).catch(()=>[]);if(els.length)o['f:'+f.url().split('?')[0].slice(-40)]=els;}
o.text=(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,500);await p.screenshot({path:'../screenshots/ev-D14-webform-public.png'});await ctx2.close();return o;
