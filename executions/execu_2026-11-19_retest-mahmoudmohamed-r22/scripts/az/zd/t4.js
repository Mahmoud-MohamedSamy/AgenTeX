async (page) => { EVAL
const out={};const ag=await z('GET','/api/v1/agents/'+TA1);out.ta1=JSON.stringify({status:ag.j?.status,online:ag.j?.isOnline??ag.j?.onlineStatus??'n/a'});
const e=await mk('QA RT20 AZ Z5 offline agent');out.e=[e.n,JSON.stringify(await waitA(e.id,60))];out.led=LEDS;return out;}
