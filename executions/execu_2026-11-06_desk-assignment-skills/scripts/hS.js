eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const txt=await (await ctx.request.get(H+'/assets/useHolidays-zEXE4oLW.js')).text();
o.defs=[...txt.matchAll(/(?:\b[lu]=`[^`]*`)|(?:n\.post\(l,[^)]{0,40}\))|(?:n\.get\(l[^)]{0,40}\))/g)].map(m=>m[0]);
o.ctx=txt.slice(0,1500);
const conv=[];let cursor=null,pages=[];
for(let i=0;i<45;i++){const r=await api('GET','/audit/events?app_key=desk&limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):''));const L=arr(r.j&&r.j.data);
  for(const e of L){if(/conversion/i.test(JSON.stringify(e)))conv.push(e);}
  const m=r.j&&r.j.meta||{};cursor=m.next_cursor;const last=L[L.length-1];pages.push(r.s+':'+L.length+':'+(last&&last.occurred_at||'').slice(0,16));if(!cursor||!L.length||(last&&last.occurred_at<'2026-11-04T15:00'))break;}
o.pages=pages.join(' ');o.convCount=conv.length;
fs.writeFileSync('../out/conversion-report.json',JSON.stringify(conv,null,1));
return o;
