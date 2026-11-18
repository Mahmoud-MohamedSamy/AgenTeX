async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';

const net=[];page.on('request',r=>{const u=r.url();if(/autoassign|roundrobin|AutoAssign|assignmentRule/i.test(u)&&!/\.js|\.css/.test(u))net.push(r.method()+' '+u.replace('https://desk.zoho.com','').slice(0,200)+' '+(r.postData()||'').slice(0,400));});
await page.mouse.click(1403,73);await page.waitForTimeout(8000);
await page.screenshot({path:R+'zd-az-5.png',fullPage:true});const t=await page.innerText('body');return t.slice(t.indexOf('Need Help')).slice(0,3000)+'\nNET\n'+net.join('\n');}
