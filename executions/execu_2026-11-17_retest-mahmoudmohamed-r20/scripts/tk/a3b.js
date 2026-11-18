const out=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/a3.out.json','utf8')).filter(x=>!/^Z|^search/.test(x[0]));
const r=await api('POST','/modules/'+TK+'/records',{data:fields({subject:'QA RT20 TK 3071 Z control',status:'Open',priority:'High',department:C.D})});const zid=r.j?.data?.id;out.push(['Z valid control',r.s,'','','','',zid?'CREATED':'']);
if(zid){LED('ticket created '+zid+' "QA RT20 TK 3071 Z control" (valid control)');C.z3071=zid;saveC();
const p=await api('PATCH','/modules/'+TK+'/records/'+zid,{data:[{field:'priority',value:{value:'Low'}}]});out.push(['M PATCH priority no kind',p.s,p.j?.error?.code||'',(p.j?.error?.message||'').slice(0,120),JSON.stringify(p.j?.error?.details||'').slice(0,160),'','']);
const o=await rec(zid);out.push(['Z after bad PATCH: priority',String(o.priority),'#'+o.ticket_number]);
const p2=await api('PATCH','/modules/'+TK+'/records/'+zid,{data:[{field:'priority',value:{kind:'string',value:'Low'}}]});const o2=await rec(zid);out.push(['N valid PATCH priority Low',p2.s,String(o2.priority)]);}
// repeat A twice for stability
for(let k=0;k<2;k++){const a=await api('POST','/modules/'+TK+'/records',{data:[{field:'subject',value:{value:'QA RT20 TK 3071 A'+k}},{field:'status',value:{kind:'string',value:'Open'}},{field:'department',value:{kind:'string',value:C.D}}]});out.push(['A repeat '+k+' (with status)',a.s,a.j?.error?.code||'',JSON.stringify(a.j?.error?.details||'').slice(0,160)]);}
const q=await api('GET','/modules/'+TK+'/records?limit=50&q='+encodeURIComponent('QA RT20 TK 3071'));out.push(['search QA RT20 TK 3071',q.s,arr(q.j?.data).map(x=>x.id===zid?'control':x.id).join(',')]);
fs.writeFileSync(RUN+'/scripts/tk/a3.out.json',JSON.stringify(out,null,1));for(const o of out.slice(-7)) log(o.join(' | '));
