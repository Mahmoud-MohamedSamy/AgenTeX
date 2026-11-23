async (page) => { EVAL
const TECH='1499272000000432293';const out={};out.before={tech:await cnt(ME,TECH)};
const a=await mk('QA RT20 AZ T1 tech thr1',{},TECH);out.a=[a.n,a.s,a.t,JSON.stringify(await waitA(a.id,60))];
const b=await mk('QA RT20 AZ T2 tech thr1 second',{},TECH);out.b=[b.n,JSON.stringify(await waitA(b.id,45))];
const p=await z('PATCH','/api/v1/tickets/'+a.id,{status:'On Hold'});out.hold=p.s+' '+(p.s>=300?p.t:p.j?.status);
await page.waitForTimeout(60000);out.bAfterHold=await get(b.id);out.cntAfterHold=await cnt(ME,TECH);
const c=await mk('QA RT20 AZ T3 tech after on hold',{},TECH);out.c=[c.n,JSON.stringify(await waitA(c.id,60))];out.ids=[a.id,b.id,c.id];out.led=LEDS;return out;}
