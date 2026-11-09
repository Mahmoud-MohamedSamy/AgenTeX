const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/evidence/skills/';
const l=await api('POST','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/query',{page:1,pageSize:5});
let id=null; const m=l.t.match(/"id":"([0-9a-f-]{36})"/); if(m) id=m[1];
if(!id){const g=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?pageSize=5');const n=g.t.match(/"id":"([0-9a-f-]{36})"/);id=n&&n[1];if(!id) return {q:l.s,qt:l.t.slice(0,300),g:g.s,gt:g.t.slice(0,300)};}
await page.setViewportSize({width:1280,height:900});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.screenshot({path:D+'tavi-ticket.png'});
const rail=await page.evaluate(()=>[...document.querySelectorAll('button,[role=tab],a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.width<64&&r.x>200&&r.x<420&&r.y>150}).map(e=>({a:e.getAttribute('aria-label'),ti:e.getAttribute('title'),tid:e.getAttribute('data-testid'),x:Math.round(e.getBoundingClientRect().x+e.getBoundingClientRect().width/2),y:Math.round(e.getBoundingClientRect().y+e.getBoundingClientRect().height/2)})));
const shots=[];
for(const [k,r] of rail.entries()){await page.mouse.click(r.x,r.y);await page.waitForTimeout(2500);await page.screenshot({path:D+`tavi-rail-${k}.png`});const txt=(await page.locator('body').innerText()).split('\n').filter(s=>/skill/i.test(s));shots.push({k,txt});}
const body=await page.locator('body').innerText();
return {id,rail,shots,skillHits:body.split('\n').filter(s=>/skill/i.test(s))};
