const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/evidence/raw/';
const out={};
const q=async p=>{const r=await api('GET',p);const a=arr(r.j&&r.j.data!==undefined?r.j.data:r.j);return {s:r.s,n:a.length,meta:r.j&&r.j.meta?{tc:r.j.meta.total_count,p:r.j.meta.page,ps:r.j.meta.page_size,more:r.j.meta.more_records,next:r.j.meta.next_cursor}:null};};
for(const p of ['/iam/users?pageSize=500','/iam/users?cursor=bzoxMDA','/iam/users?page=1&pageSize=100','/iam/users?page=3&pageSize=100','/iam/users?search=ndceg','/iam/users?search=zzzz-none'])out[p]=await q(p);
// newest user (who made 201)
const all=arr((await api('GET','/iam/users')).j.data);out.total=all.length;
const fs=require('fs');fs.writeFileSync(D+'c-iam-users-emails.txt',all.map(u=>u.status+' '+(u.displayName||'')).join('\n'));
// UI: CRM users list count
await page.setViewportSize({width:1600,height:1000});
await page.goto('https://staging-crm.taviportal.com/settings/general/users',{waitUntil:'load',timeout:120000}).catch(()=>{});
for(let i=0;i<40;i++){const t=await page.locator('body').innerText().catch(()=>'');if(/user/i.test(t)&&t.length>800)break;await page.waitForTimeout(1500);}await page.waitForTimeout(5000);
const t=await page.locator('body').innerText().catch(()=>'');out.crmUsersCount=(t.match(/\b\d{2,3}\b[^\n]{0,30}(users|Users|results|of)/g)||[]).slice(0,8);
await page.screenshot({path:D+'c-crm-users-list.png'});
return out;
