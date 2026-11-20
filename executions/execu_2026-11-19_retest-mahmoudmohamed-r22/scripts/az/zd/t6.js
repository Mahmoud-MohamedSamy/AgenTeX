async (page) => { EVAL
const TECH='1499272000000432293';const out={};
out.hold147=(await z('PATCH','/api/v1/tickets/1499272000000483499',{status:'On Hold'})).s;await page.waitForTimeout(3000);out.cnt=await cnt(ME,TECH);
for(const [k,s] of [['sk1','QA RT20 AZ SK1 SKA SKC'],['sk2','QA RT20 AZ SK2 SKC only'],['sk3','QA RT20 AZ SK3 no skill']]){const t=await mk(s,{},TECH);const g=await waitA(t.id,50);const d=await z('GET','/api/v1/tickets/'+t.id+'?include=skills');out[k]=[t.n,t.id,g.as,'skills='+JSON.stringify(d.j?.entitySkills||d.j?.skills||null)];
 if(g.as!=='none'){out[k].push('hold '+(await z('PATCH','/api/v1/tickets/'+t.id,{status:'On Hold'})).s);await page.waitForTimeout(3000);}}
out.led=LEDS;return out;}
