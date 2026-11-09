eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
let txt='';for(const d of ['HolidaysPage-CFd8sdtC.js','holiday-routes-D3vsoNHq.js','HolidayListFormPage-1w4YG8Mf.js']){txt+=await (await ctx.request.get(H+'/assets/'+d)).text();}
const imp=[...new Set([...txt.matchAll(/from"\.\/([^"]+\.js)"/g)].map(m=>m[1]))].filter(x=>/oliday|usiness/i.test(x));o.imp=imp;
for(const d of imp)txt+=await (await ctx.request.get(H+'/assets/'+d)).text();
o.calls=[...new Set([...txt.matchAll(/[A-Za-z]\.(get|post|put|patch|delete)\(`[^`]*`[^)]{0,80}\)/g)].map(m=>m[0]))].slice(0,30);
o.fields=[...new Set([...txt.matchAll(/.{0,60}(holiday_date|start_date|end_date|occasion|recurr|applies_to|business_hours_profile|is_recurring)[^,]{0,60}/g)].map(m=>m[0]))].slice(0,15);
// conversion report entries, full
const conv=[];let cursor=null;
for(let i=0;i<40;i++){const r=await api('GET','/audit/events?app_key=desk&limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):''));const L=arr(r.j&&r.j.data);
  for(const e of L){if(/conversion/i.test(e.actor_label||'')||/conver/i.test(JSON.stringify(e.metadata||e.changes||e.details||'')))conv.push(e);}
  const m=r.j&&r.j.meta||{};cursor=m.next_cursor;const last=L[L.length-1];if(!cursor||!L.length||(last&&last.occurred_at<'2026-11-04T15:00'))break;}
o.convCount=conv.length;o.convKeys=conv[0]&&Object.keys(conv[0]);
fs.writeFileSync('../out/conversion-report.json',JSON.stringify(conv,null,1));
return o;
