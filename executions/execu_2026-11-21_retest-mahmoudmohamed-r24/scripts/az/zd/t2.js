async (page) => { EVAL
const out={};const A='1499272000000483192',B='1499272000000483242';
const p=await z('PATCH','/api/v1/tickets/'+A,{status:'On Hold'});out.hold=p.s+' '+(p.s>=300?p.t:'');await page.waitForTimeout(5000);out.cnt=await cnt(TA1);out.A=await get(A);
const c=await mk('QA RT20 AZ Z3 after on hold');out.c=[c.n,JSON.stringify(await waitA(c.id,60))];out.B=await get(B);out.cid=c.id;out.led=LEDS;return out;}
