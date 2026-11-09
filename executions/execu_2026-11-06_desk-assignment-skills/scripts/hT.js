eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const html=await (await ctx.request.get(H+'/')).text();const main=html.match(/src="([^"]+index[^"]+\.js)"/)[1];
const t=await (await ctx.request.get(H+main)).text();
o.ops=[...t.matchAll(/.{0,300}(on_holiday|not_on_holiday).{0,400}/g)].map(m=>m[0]).slice(0,3);
const f=await (await ctx.request.get(H+'/assets/HolidayListFormPage-1w4YG8Mf.js')).text();
o.submit=[...f.matchAll(/.{0,200}(\.create\(|\.update\(|setBusinessHours|business_hours_id|businessHoursId).{0,300}/g)].map(m=>m[0]).slice(0,6);
const bh=await api('GET','/desk/business-hours');o.bh=bh.t.slice(0,1500);
const rr=await api('GET','/desk/assignment-rules/fields?department_id='+IDS.DA);o.fields=rr.s;
return o;
