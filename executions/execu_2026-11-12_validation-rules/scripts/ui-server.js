// Headed Edge for TAVI CRM, signed in once through the login form as <label>. Port 8893, POST /run {code}.
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../../..'); const {chromium}=require(path.join(ROOT,'node_modules/playwright'));
const label=process.argv[2]; const PORT=+process.argv[3]||8893;
const rows=fs.readFileSync(path.join(ROOT,'docs/Credentials/TAVI Desk Credentials.csv'),'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l=>l.split(','));
const r=rows.find(x=>x[0]===label); if(!r){console.error('no label');process.exit(1);} const U=r[1].trim(), PW=r.slice(2).join(',').trim();
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'}); const ctx=await b.newContext({viewport:{width:1600,height:900}});
 let page=await ctx.newPage(); await page.goto('https://staging-'+(process.argv[4]||'crm')+'.taviportal.com/',{waitUntil:'domcontentloaded',timeout:120000}).catch(()=>{});
 await page.waitForSelector('input[type=email], input[name=email], input[type=text]',{timeout:60000}).catch(()=>{});
 const em=page.locator('input[type=email], input[name=email]').first(); if(await em.count()){await em.fill(U); const pw=page.locator('input[type=password]'); if(!(await pw.count())){await page.keyboard.press('Enter');} await page.waitForSelector('input[type=password]',{timeout:30000}); await page.locator('input[type=password]').fill(PW); await page.keyboard.press('Enter');}
 await page.waitForTimeout(10000); console.log('url',page.url().replace(/\?.*/,''));
 http.createServer((req,res)=>{let s='';req.on('data',d=>s+=d);req.on('end',async()=>{try{if(page.isClosed())page=ctx.pages().slice(-1)[0]||await ctx.newPage();const {code}=JSON.parse(s);const out=await eval(code)(page,ctx);res.end(JSON.stringify({ok:true,out}));}catch(e){res.end(JSON.stringify({ok:false,err:String(e.message).slice(0,400)}));}});}).listen(PORT,'127.0.0.1',()=>console.log('ui ready '+PORT));
})().catch(e=>{console.error('ERR',e.message.slice(0,200));process.exit(1);});
