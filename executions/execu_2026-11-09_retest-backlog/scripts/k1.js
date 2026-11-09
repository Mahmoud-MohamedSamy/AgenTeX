const fs=require('fs');const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/evidence/skills/';
await page.goto(H+'/views/all/tickets/6d6dfe26-8107-4212-9270-7bb565013fd8',{waitUntil:'load',timeout:120000});
await page.waitForTimeout(9000);
if(/Sign in/i.test(await page.locator('body').innerText())) return {signedOut:true};
await page.setViewportSize({width:1280,height:900});
await page.screenshot({path:D+'tavi-ticket.png'});
const rail=await page.evaluate(()=>[...document.querySelectorAll('button,[role=tab],a')].filter(e=>{const r=e.getBoundingClientRect();return r.x>280&&r.x<340&&r.width<60&&r.height>0}).map(e=>({t:e.innerText.trim(),a:e.getAttribute('aria-label'),ti:e.getAttribute('title'),tid:e.getAttribute('data-testid'),y:Math.round(e.getBoundingClientRect().y)})));
const shots=[];const btns=page.locator('button,[role=tab],a');
let i=0;for(const r of rail){const el=page.locator(`xpath=//*[self::button or self::a or @role='tab']`).filter({has:page.locator('svg')});i++;}
// click each rail item by position
for(const [k,r] of rail.entries()){await page.mouse.click(313,r.y+10);await page.waitForTimeout(2500);const head=await page.evaluate(()=>{const p=[...document.querySelectorAll('h1,h2,h3,[class*=title]')].filter(e=>{const r=e.getBoundingClientRect();return r.x>330&&r.x<640&&r.y<240});return p.map(e=>e.innerText.trim()).filter(Boolean).slice(0,3)});await page.screenshot({path:D+`tavi-rail-${k}.png`});shots.push({k,head});}
const body=await page.locator('body').innerText();
const skillHits=body.split('\n').filter(l=>/skill/i.test(l));
// skills field on record via API
const rec=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/6d6dfe26-8107-4212-9270-7bb565013fd8');
const skillsInRec=rec.t.match(/.{0,80}skill.{0,120}/gi);
return {rail,shots,skillHits,recStatus:rec.s,skillsInRec};
