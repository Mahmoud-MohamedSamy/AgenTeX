const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653',TK='88e8ea44-1658-4df3-9930-d0902b91073d',CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const TASK='d520655a-3a31-4796-bd33-b639e4456e56',CALL='98f86824-ecb2-4a2a-acbe-9fa12435cd27',T='372b88df-6733-4c61-a774-0202a0148fd5',C='daf6afa2-d952-41f6-afbb-f7223e49408a';
const out={api:{},ui:{},blocked:[]};
const me=await api('GET','/iam/me');out.me=me.j&&(me.j.data||me.j).displayName;
const g=async(k,p)=>{const r=await api('GET',p);out.api[k]=r.s+(r.s===200?' '+JSON.stringify(((r.j&&r.j.data&&r.j.data.data)||[]).filter(z=>/subject|department/.test(z.field)).map(z=>z.field+'='+(z.value&&z.value.value))).slice(0,160):' '+r.t.slice(0,120));};
await g('task',`/modules/${TM}/records/${TASK}`);await g('call',`/modules/${CL}/records/${CALL}`);await g('ticket',`/modules/${TK}/records/${T}`);await g('contact',`/modules/${CT}/records/${C}`);
const tl=await api('GET',`/modules/${TM}/records?pageSize=200`);const ts=arr(tl.j);out.api.taskList=tl.s+' rows '+ts.length+' ourTaskListed '+ts.some(x=>x.id===TASK);
const cl=await api('GET',`/modules/${CL}/records?pageSize=200`);const cs=arr(cl.j);out.api.callList=cl.s+' rows '+cs.length+' ourCallListed '+cs.some(x=>x.id===CALL);
const kl=await api('GET',`/modules/${TK}/records?pageSize=200`);out.api.ticketList=kl.s+' rows '+arr(kl.j).length+' ourTicketListed '+arr(kl.j).some(x=>x.id===T);
// depts of tasks visible to agent
const dset={};for(const x of ts){const d=((x.data||[]).find(z=>z.field==='department')||{}).value;const v=d&&d.value;dset[v]=(dset[v]||0)+1;}out.api.taskDeptCounts=Object.keys(dset).length;
// UI
await page.route('**/api/v1/**',r=>{const m=r.request().method();const x=r.request().url();if(m==='PUT'||m==='PATCH'||m==='DELETE'||(m==='POST'&&/records\/|complete|timer/i.test(x)&&!/summaries|resolve/.test(x))){out.blocked.push(m+' '+x.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
const resp=[];page.on('response',r=>{const u=r.url();if(/api\/v1/.test(u)&&r.status()>=400)resp.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'').slice(0,90));});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
out.ui.activitiesUrl=page.url();const bt=await page.locator('body').innerText();out.ui.listShowsTask=/QA RT BUG dept task/.test(bt);out.ui.listShowsCall=/QA RT BUG dept call/.test(bt);out.ui.toasts=bt.split('\n').filter(l=>/denied|permission|forbidden/i.test(l)).slice(0,4);
await page.screenshot({path:D+'b2-agent-activities-list.png'});
for(const [k,u] of [['taskPage','/activities/tasks/'+TASK],['callPage','/activities/calls/'+CALL]]){await page.goto(H+u,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);const t=await page.locator('body').innerText();out.ui[k]={url:page.url(),showsSubject:/QA RT BUG dept/.test(t),lines:t.split('\n').filter(l=>/QA RT BUG|HR|denied|permission|not found|Mark as Complete|Delete|Edit/i.test(l)).slice(0,12)};await page.screenshot({path:D+'b2-agent-'+k+'.png'});}
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);const tt=await page.locator('body').innerText();out.ui.ticketPage={showsSubject:/QA RT BUG composer check/.test(tt),lines:tt.split('\n').filter(l=>/denied|permission|not found|access/i.test(l)).slice(0,5)};await page.screenshot({path:D+'b2-agent-ticket.png'});
out.http4xx=[...new Set(resp)].slice(0,25);
return out;
