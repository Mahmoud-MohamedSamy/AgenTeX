// Front-end checks on the QA 2822 forms embedded on 127.0.0.1:5500 (signed out). Captures the submission body shape (keys only).
const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
const RAW=path.join(__dirname,'..','screenshots','raw');const form=process.argv[2];const plan=JSON.parse(process.argv[3]);
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const ctx=await b.newContext({viewport:{width:1280,height:1300}});const page=await ctx.newPage();
const R={posts:[],steps:[],all:[]};const cl=u=>u.replace(/^https?:\/\/[^/]+/,'').replace(/fw1[^/?]+/g,'<key>').slice(0,80);page.on('requestfinished',async q=>{const r=await q.response();R.all.push(q.method()+' '+cl(q.url())+' '+(r?r.status():'-'));});page.on('requestfailed',q=>R.all.push('FAILED '+cl(q.url())+' '+(q.failure()||{}).errorText));page.on('console',m=>R.all.push('console '+m.type()+' '+m.text().slice(0,120)));page.on('request',async q=>{if(/submissions/.test(q.url()))R.posts.push((q.postData()||'').replace(/"[^"]*@[^"]*"/g,'"<email>"').slice(0,700));});
page.on('response',async r=>{if(/submissions/.test(r.url()))R.subStatus=r.status();});
await page.goto('http://127.0.0.1:5500/f'+form+'.html');for(let w=0;w<20&&!page.frames().find(f=>/taviportal/.test(f.url()));w++)await page.waitForTimeout(1500);await page.waitForTimeout(4000);
const fr=page.frames().find(f=>/taviportal/.test(f.url()));const T=async()=>(await fr.locator('body').innerText()).replace(/\s+/g,' ');
R.labels=(await T()).slice(0,300);R.dir=await fr.evaluate(()=>document.documentElement.dir+'/'+getComputedStyle(document.querySelector('form')||document.body).direction+'/lang='+document.documentElement.lang);
const byLabel=l=>fr.getByLabel(new RegExp('^'+l,'i')).first();
for(const [label,val,kind] of plan.fill){const el=byLabel(label);if(kind==='select'){await el.selectOption({index:1}).catch(e=>R.steps.push('sel fail '+label));continue;}
 await el.fill(val).catch(e=>R.steps.push('fill fail '+label+' '+e.message.slice(0,60)));await el.blur().catch(()=>{});await page.waitForTimeout(400);}
R.afterBlur=(await T()).slice(0,900);await page.screenshot({path:path.join(RAW,'2822-'+form+'-'+plan.tag+'-blur.png'),fullPage:true});
await fr.getByRole('button',{name:/^(Send|إرسال)/}).click();await page.waitForTimeout(plan.wait||4000);R.t0=Date.now();for(let w=0;w<60&&/Sending/.test(await T());w++)await page.waitForTimeout(2000);
R.sendMs=Date.now()-(R.t0||Date.now());R.focused=await fr.evaluate(()=>{const a=document.activeElement;const l=a&&a.id&&document.querySelector('label[for="'+a.id+'"]');return a?(a.tagName+' '+(l?l.innerText:a.name||'')):'none';});
R.afterSend=(await T()).slice(0,900);R.values={};for(const [label] of plan.fill){R.values[label]=await byLabel(label).inputValue().catch(()=>'?');}
await page.screenshot({path:path.join(RAW,'2822-'+form+'-'+plan.tag+'-send.png'),fullPage:true});
console.log(JSON.stringify(R,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
