const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/tavi/';
const out={};await page.setViewportSize({width:1440,height:900});
const wt=async(re,ms=150000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.locator('body').innerText().catch(()=>'');if(re.test(t))return t;await page.waitForTimeout(2000);}return null;};
await page.goto(H+'/settings/security/audit-log',{waitUntil:'commit',timeout:180000});await wt(/RECENT ACTIVITY/i);await page.waitForTimeout(5000);
const fu=page.locator('button:has-text("All Users")').first();
if(await fu.count()){await fu.click();await page.waitForTimeout(1500);const s=page.locator('input[placeholder*="earch" i]').last();if(await s.count()){await s.fill('mahmoud.mahamed1515');await page.waitForTimeout(2500);}const opt=page.locator('[role=option],[role=menuitemcheckbox],[role=menuitem],label').filter({hasText:/mahmoud\.mahamed1515/}).first();if(await opt.count()){await opt.click();await page.waitForTimeout(1500);}await page.keyboard.press('Escape');await page.waitForTimeout(4000);}
for(let i=0;i<15;i++){const t=await page.locator('body').innerText();if(/title from blank value to QA FT 1865 K bulk/.test(t))break;const m=page.locator('button:has-text("Load more"),button:has-text("Show more")').first();if(await m.count()){await m.click().catch(()=>{});await page.waitForTimeout(3000);}else{await page.mouse.wheel(0,3000);await page.waitForTimeout(2500);}}
const mu=page.getByText(/title from blank value to QA FT 1865 K bulk/).first();out.k1=await mu.count();if(out.k1){await mu.scrollIntoViewIfNeeded();await page.mouse.wheel(0,-300);await page.waitForTimeout(1500);await page.screenshot({path:D+'k1-audit-massupdate.png'});}
// E: integration overview + failure log
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:180000});await wt(/Sync queue|Parked/i);await page.waitForTimeout(5000);
const t1=await page.locator('body').innerText();out.parked=(t1.match(/Parked\s*\n?\s*(\d+)/)||[])[1];out.attention=(t1.match(/Needs attention:\s*(\d+)/)||[])[1];
const pk=page.getByText(/^Parked$/).first();if(await pk.count()){await pk.scrollIntoViewIfNeeded();await page.mouse.wheel(0,-200);await page.waitForTimeout(1000);}
await page.screenshot({path:D+'e-overview.png'});
const tab=page.getByText(/^Failure Log$/).first();if(await tab.count()){await tab.click();await page.waitForTimeout(8000);await wt(/fail|record|reason/i,60000);
 const t2=await page.locator('body').innerText();const i=t2.indexOf('Failure Log');out.failSeg=t2.slice(i,i+700).split('\n').filter(Boolean).slice(0,25);
 out.countLines=t2.split('\n').filter(l=>/\b(226|records?|results?|of \d+|total)\b/i.test(l)).slice(0,10);
 await page.screenshot({path:D+'e-failure-log.png'});
 await page.mouse.wheel(0,20000);await page.waitForTimeout(2500);await page.screenshot({path:D+'e-failure-log-bottom.png'});
 const t3=await page.locator('body').innerText();out.bottom=t3.split('\n').filter(l=>/\d+\s*(–|-|to)\s*\d+|of \d+|Page|Showing|Load more/i.test(l)).slice(0,8);}
const f=await api('GET','/desk/integrations/crm/failures?limit=500');out.failApi=f.s+' n='+arr(f.j&&(f.j.data||f.j)).length+' '+JSON.stringify((f.j&&f.j.meta)||'').slice(0,200);
const st=await api('GET','/desk/integrations/crm/status');out.status=st.s+' '+JSON.stringify(st.j&&st.j.data||'').slice(0,600);
return out;
