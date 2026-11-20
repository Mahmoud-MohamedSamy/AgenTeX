async (page) => { EVAL
const out={};out.before=await cnt(TA1);
const a=await mk('QA RT20 AZ Z1 thr1 first');await page.waitForTimeout(5000);out.a=[a.n,a.s,a.t,JSON.stringify(await waitA(a.id,60))];
const b=await mk('QA RT20 AZ Z2 thr1 second');out.b=[b.n,JSON.stringify(await waitA(b.id,60))];out.ids=[a.id,b.id];out.led=LEDS;out.after=await cnt(TA1);return out;}
