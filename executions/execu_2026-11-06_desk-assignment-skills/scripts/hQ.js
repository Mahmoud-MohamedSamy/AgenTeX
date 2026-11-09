// 7 Nov: discovery for holiday criteria + audit conversion report (read-only)
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const html=await (await ctx.request.get(H+'/')).text();
const mains=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);o.mains=mains;
let all='';for(const m of mains){all+=await (await ctx.request.get(H+m)).text();}
const deps=[...new Set([...all.matchAll(/assets\/((?:Holiday|holiday|BusinessHours|business-hours|AuditLog|audit)[^"`']*\.js)/g)].map(m=>m[1]))];o.deps=deps;
let txt=all;for(const d of deps){txt+=await (await ctx.request.get(H+'/assets/'+d)).text();}
const grab=(re,n=12)=>[...new Set([...txt.matchAll(re)].map(m=>m[0]))].slice(0,n);
o.holEndpoints=grab(/.{0,40}\/(desk\/)?(holiday|business-hours)[a-z\-\/${}.]*.{0,60}/g,20);
o.holOps=grab(/.{0,120}(on_holiday|not_on_holiday).{0,160}/g,4);
o.auditEndpoints=grab(/.{0,40}\/audit\/[a-z\-\/${}.]*.{0,40}/g,10);
for(const p of ['/desk/holiday-lists','/desk/holidays','/desk/holidays/lists','/desk/business-hours','/desk/business-hours/profiles','/desk/holiday_lists']){const r=await api('GET',p);o['GET '+p]=r.s+' '+r.t.slice(0,400);}
// audit: page all events, look for conversion / migration
const fac=await api('GET','/audit/events/facets?app_key=desk');o.facets=fac.t.slice(0,2500);
let cursor=null,n=0,types={},hits=[],oldest=null,meta0=null;
for(let i=0;i<60;i++){const r=await api('GET','/audit/events?app_key=desk&limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):'')+(i>0&&!cursor?'&offset='+n:''));const L=arr(r.j&&r.j.data);if(i===0)meta0=r.j&&r.j.meta;
  for(const e of L){const k=e.target_type+'|'+e.action;types[k]=(types[k]||0)+1;const s=JSON.stringify(e);if(/migrat|conver|refactor|legacy|old_rule|capacity/i.test(s))hits.push((e.occurred_at||e.created_at||'')+' '+k+' '+(e.target_label||'')+' '+s.slice(0,300));oldest=e.occurred_at||e.created_at||oldest;}
  n+=L.length;const m=r.j&&r.j.meta||{};cursor=m.next_cursor||m.nextCursor||(m.pagination&&m.pagination.next_cursor)||null;if(!L.length||(!cursor&&L.length<200))break;if(!cursor&&i>0&&L.length===200&&o._noCursor)break;if(!cursor)o._noCursor=true;}
o.audit={meta0,total:n,oldest,types,hits:hits.slice(0,30)};
return o;
