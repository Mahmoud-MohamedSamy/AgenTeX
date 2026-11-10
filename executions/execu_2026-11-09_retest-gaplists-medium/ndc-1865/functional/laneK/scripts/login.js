// Sign in to TAVI Desk staging as account #idx of the scratchpad creds file; save storage state. Prints nothing secret.
// Usage: CREDS=<json> node login.js <idx> <outState> [orgName]
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const A=JSON.parse(fs.readFileSync(process.env.CREDS,'utf8'));const [idx,out,org]=process.argv.slice(2);const C=A[+idx];
const H='https://staging-desk.taviportal.com';const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto(H+'/',{waitUntil:'commit',timeout:90000});await page.waitForSelector('input[type=password]',{timeout:300000});
await page.locator('input:not([type=password]):not([type=hidden])').first().fill(C.user);await page.fill('input[type=password]',C.pw);
await page.locator('form button[type=submit]').first().click();
for(let i=0;i<90;i++){await page.waitForTimeout(1000);const t=await page.innerText('body').catch(()=>'');
 if(/invalid email or password|too many|session limit/i.test(t)){console.error('login refused:',(t.match(/invalid email or password|too many[^\n]*|session limit[^\n]*/i)||[''])[0]);await page.screenshot({path:out+'.fail.png'});process.exit(2);}
 if(org&&/organi[sz]ation/i.test(t)&&await page.$('text='+org)){await page.locator('text=/^'+org+'$/').first().click().catch(()=>{});}
 if(!(await page.$('input[type=password]'))&&!/organi[sz]ation/i.test(t))break;}
await page.waitForTimeout(5000);const t=await page.innerText('body').catch(()=>'');
if(await page.$('input[type=password]')){await page.screenshot({path:out+'.fail.png'});throw new Error('not signed in: '+page.url());}
if(/organi[sz]ation/i.test(t)&&/select|choose/i.test(t)){console.log('ORG PICKER still shown; orgs text:',t.slice(0,300));}
await ctx.storageState({path:out});console.log('signed in',C.name,page.url());await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
