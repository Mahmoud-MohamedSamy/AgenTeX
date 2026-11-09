eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const d=await api('GET','/iam/tenant/business-hours/profiles/a0302234-3896-41de-9b85-443a555a7131');o.def=d.s+' '+d.t.slice(0,1500);
const l=await api('GET','/desk/holiday-lists/'+IDS.HOL1);o.l1=l.t.slice(0,600);
const f=await (await ctx.request.get(H+'/assets/HolidayListFormPage-1w4YG8Mf.js')).text();
o.upd=[...f.matchAll(/function Ae\(e,t\)\{.{0,500}/g)].map(m=>m[0]);
const b=await (await ctx.request.get(H+'/')).text();const main=b.match(/src="([^"]+index[^"]+\.js)"/)[1];const t=await (await ctx.request.get(H+main)).text();
o.bhCreate=[...t.matchAll(/.{0,100}createBusinessHoursProfile.{0,200}/g)].map(m=>m[0]).slice(0,2);
return o;
