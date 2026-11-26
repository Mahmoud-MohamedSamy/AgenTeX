// node zs-login.js <outState>  Sign in with row 2 of the 14-11 CSV (headed Edge), then open social.zoho.com. Prints no secret.
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const rows=fs.readFileSync(path.join(P,'docs/Credentials/Zoho Credentials 14-11-2026.csv'),'utf8').trim().split(/\r?\n/);
const hdr=rows[0].split(',').map(x=>x.trim().toLowerCase());const ui=hdr.indexOf('username'),pi=hdr.indexOf('password');
const cells=rows[2].split(',');const user=cells[ui].trim();const pw=cells.slice(pi).join(',').trim();
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const out=process.argv[2];const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto('https://accounts.zoho.com/signin',{waitUntil:'domcontentloaded',timeout:90000});
await page.fill('#login_id',user);await page.click('#nextbtn');await page.waitForSelector('#password',{state:'visible',timeout:30000});
await page.fill('#password',pw);await page.click('#nextbtn');
for(let k=0;k<45;k++){await page.waitForTimeout(1000);const u=page.url();const s=page.locator('text=/Remind me later|Skip for now|Not now/i');if(await s.count())await s.first().click().catch(()=>{});if(/accounts\.zoho\.com\/home|myaccount/.test(u))break;}
await page.goto('https://social.zoho.com/',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});await page.waitForTimeout(15000);
console.log('URL',page.url().replace(/[?#].*$/,'').slice(0,100),'TITLE',(await page.title()).slice(0,60));
await page.screenshot({path:path.join(path.dirname(out),'shots/00-landing.png')});
console.log((await page.innerText('body').catch(()=>'')).slice(0,1500));
await ctx.storageState({path:out});await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1);});
