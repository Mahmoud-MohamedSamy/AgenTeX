const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));const RAW=path.join(__dirname,'..','screenshots','raw');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const out={};
for(const [host,pg,fill] of (process.env.ONLYDESK?[['localhost','desk24',[['Last Name','QA RT24 3138 desk'],['Email','qa.rt24.3138@example.com'],['Subject','QA RT24 3138 desk embed']]],['127.0.0.1','desk24',null]]:[['localhost','crm24',[['Full Name','QA RT24 3138 crm']]],['localhost','desk24',[['Last Name','QA RT24 3138 desk'],['Email','qa.rt24.3138@example.com'],['Subject','QA RT24 3138 desk embed']]],['127.0.0.1','crm24',null],['localhost','fA24',null]])){
 const page=await (await b.newContext({viewport:{width:1280,height:1000}})).newPage();const R={bad:[],cons:[]};out[host+' '+pg]=R;
 page.on('response',r=>{if(r.status()>=400&&/taviportal/.test(r.url()))R.bad.push(r.status()+' '+r.url().replace(/fw1[^/?]+/g,'<key>').replace(/^https:\/\/[^/]+/,'').slice(0,80))});page.on('console',m=>{if(m.type()==='error')R.cons.push(m.text().slice(0,120))});
 await page.goto('http://'+host+':5500/'+pg+'.html');for(let w=0;w<20&&!page.frames().find(f=>/taviportal/.test(f.url()));w++)await page.waitForTimeout(1500);await page.waitForTimeout(6000);
 const fr=page.frames().find(f=>/taviportal/.test(f.url()));R.iframe=!!fr;R.text=fr?(await fr.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300):'';
 await page.screenshot({path:path.join(RAW,'3138-'+host+'-'+pg+'.png'),fullPage:true});
 if(fr&&fill){for(const [l,v] of fill)await fr.getByLabel(new RegExp('^'+l,'i')).first().fill(v).catch(e=>R.cons.push('fill '+l));
  page.on('response',r=>{if(/submissions/.test(r.url()))R.sub=r.status()});await fr.getByRole('button',{name:/^Send/}).click();await page.waitForTimeout(8000);
  R.after=(await fr.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200);await page.screenshot({path:path.join(RAW,'3138-'+host+'-'+pg+'-sent.png'),fullPage:true});}
 await page.context().close();}
console.log(JSON.stringify(out,null,1));await b.close();})();
