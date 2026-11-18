const dep={field:'department',value:{kind:'string',value:C.D}};
const S=s=>({field:'subject',value:{kind:'string',value:'QA RT21 TK 3071 '+s}});
const cases=[
['A subject no kind',{data:[{field:'subject',value:{value:'QA RT21 TK 3071 A'}},dep]}],
['B priority no kind',{data:[S('B'),{field:'priority',value:{value:'High'}},dep]}],
['C department no kind',{data:[S('C'),{field:'department',value:{value:C.D}}]}],
['D unknown kind',{data:[{field:'subject',value:{kind:'bogus',value:'QA RT21 TK 3071 D'}},dep]}],
['E value plain string',{data:[{field:'subject',value:'QA RT21 TK 3071 E'},dep]}],
['F value empty object',{data:[{field:'subject',value:{}},dep]}],
['G value null',{data:[{field:'subject',value:null},dep]}],
['H kind only no value',{data:[{field:'subject',value:{kind:'string'}},dep]}],
['I kind null',{data:[{field:'subject',value:{kind:null,value:'QA RT21 TK 3071 I'}},dep]}],
['J kind number on text',{data:[{field:'subject',value:{kind:'number',value:'QA RT21 TK 3071 J'}},dep]}],
['K array no kind items',{data:[S('K'),{field:'tags',value:{kind:'array',items:[{value:'x'}]}},dep]}],
['L no value key at all',{data:[{field:'subject'},dep]}],
['M PATCH no kind',null],
['Z valid control',{data:[S('Z control'),{field:'priority',value:{kind:'string',value:'High'}},dep]}],
];
const out=[];let zid=null;
for(const [n,b] of cases){ if(!b) continue; const r=await api('POST','/modules/'+TK+'/records',b); const e=r.j?.error; const id=r.j?.data?.id; if(id){ if(n.startsWith('Z')) zid=id; LED('ticket created '+id+' via 3071 case '+n);} out.push([n,r.s,e?.code||'',(e?.message||'').slice(0,120),JSON.stringify(e?.details||'').slice(0,160),r.j?.meta?.trace_id||e?.trace_id||(r.t.match(/trace[_A-Za-z]*\":\"([^\"]+)/)||[])[1]||'',id?'CREATED':'']); }
// PATCH on control with no-kind value
if(zid){ const r=await api('PATCH','/modules/'+TK+'/records/'+zid,{data:[{field:'priority',value:{value:'Low'}}]}); out.push(['M PATCH priority no kind',r.s,r.j?.error?.code||'',(r.j?.error?.message||'').slice(0,120),JSON.stringify(r.j?.error?.details||'').slice(0,160),'','']); const o=await rec(zid); out.push(['Z after PATCH priority',o.priority, o.ticket_number]);}
// any 3071 junk created?
const q=await api('GET','/modules/'+TK+'/records?limit=50&q='+encodeURIComponent('QA RT21 TK 3071'));out.push(['search 3071',q.s,arr(q.j?.data).length]);
fs.writeFileSync(RUN+'/scripts/tk/a3.out.json',JSON.stringify(out,null,1));
for(const o of out) log(o.join(' | '));
