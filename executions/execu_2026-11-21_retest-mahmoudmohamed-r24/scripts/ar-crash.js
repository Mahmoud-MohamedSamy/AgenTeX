const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
const RAW=path.join(__dirname,'..','screenshots','raw');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:process.env.HEAD!=='1'});const p=await (await b.newContext({viewport:{width:1280,height:1100}})).newPage();const R={ev:[]};
p.on('crash',()=>R.ev.push('CRASH '+new Date().toISOString().slice(11,19)));p.on('console',m=>{if(m.type()==='error')R.ev.push('console '+m.text().slice(0,140));});p.on('pageerror',e=>R.ev.push('pageerror '+e.message.slice(0,160)));
await p.goto('http://127.0.0.1:5500/fB.html');for(let w=0;w<20&&!p.frames().find(f=>/taviportal/.test(f.url()));w++)await p.waitForTimeout(1500);await p.waitForTimeout(4000);
const fr=p.frames().find(f=>/taviportal/.test(f.url()));R.loaded=!!fr;
try{R.text=(await fr.locator('body').innerText()).replace(/\s+/g,' ').slice(0,300);R.dir=await fr.evaluate(()=>document.documentElement.dir+'/'+document.documentElement.lang+'/'+getComputedStyle(document.body).direction);await p.screenshot({path:path.join(RAW,'2822-B-ar-load.png'),fullPage:true});
 const inputs=fr.locator('input:visible');R.n=await inputs.count();
 for(let i=0;i<R.n;i++){const el=inputs.nth(i);const t=(await el.getAttribute('type'))||'text';const bb=await el.boundingBox();if(!bb||bb.x<0||bb.width<5)continue;R.ev.push('fill '+i+' '+t);await el.fill(t==='email'?'not-an-email':t==='tel'?'12ab!!':'x');await el.blur();await p.waitForTimeout(800);}
 R.afterBlur=(await fr.locator('body').innerText()).replace(/\s+/g,' ').slice(0,600);await p.screenshot({path:path.join(RAW,'2822-B-ar-blur.png'),fullPage:true});
 await fr.getByRole('button',{name:/^(Send|إرسال)/}).click();await p.waitForTimeout(3000);R.afterSend=(await fr.locator('body').innerText()).replace(/\s+/g,' ').slice(0,600);await p.screenshot({path:path.join(RAW,'2822-B-ar-send.png'),fullPage:true});
}catch(e){R.err=e.message.slice(0,150);}
console.log(JSON.stringify(R,null,1));await b.close();})();
