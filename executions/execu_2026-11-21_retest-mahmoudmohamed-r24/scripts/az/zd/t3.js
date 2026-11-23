async (page) => { EVAL
const out={};const A='1499272000000483192',B='1499272000000483242',C='1499272000000483288';
let p=await z('POST','/api/v1/tickets/'+A+'/transitions/1499272000000432076/perform',{});out.perf=p.s+' '+(p.s>=300?p.t:'');
if(p.s>=300){p=await z('POST','/api/v1/tickets/'+A+'/transitions/1499272000000432076/perform',{transitionId:'1499272000000432076'});out.perf2=p.s+' '+p.t.slice(0,300);}
await page.waitForTimeout(6000);out.A=await get(A);out.cnt=await cnt(TA1);out.B=await get(B);out.C=await get(C);
const d=await mk('QA RT20 AZ Z4 after on hold');out.d=[d.n,JSON.stringify(await waitA(d.id,60))];out.did=d.id;out.led=LEDS;return out;}
