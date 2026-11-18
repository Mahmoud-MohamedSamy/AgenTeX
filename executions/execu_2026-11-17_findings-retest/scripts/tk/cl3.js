const CON2='0924eb24-e42a-4eab-8efd-e3428f19e882';
const mine=new Set([...(C.f10||[]),C.f13a,C.f13b,C.f13c,C.f13cloneA,C.f13cloneC,C.f08,...(C.bulk||[]),...(C.bulk2||[]),...(C.f06||[]),C.V].filter(Boolean));
let all=[],cur=null;const seen=new Set();
for(let p=0;p<40;p++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200)break;const a=arr(r.j?.data);let f=0;for(const x of a){if(!seen.has(x.id)){seen.add(x.id);all.push(x);f++;}}cur=r.j?.meta?.next_cursor;if(!cur||!f)break;}
log('bin scanned',all.length,'mine left',all.filter(x=>mine.has(x.record_id)).length,'label QA RT21 TK left',all.filter(x=>/QA RT21 TK/.test(x.record_label||'')).length);
const codes={};for(const id of [...(C.f10||[]),C.f13a,C.f13b,C.f13c,C.f13cloneA,C.f13cloneC,C.f08,...(C.bulk||[]),...(C.bulk2||[])]){const r=await api('GET','/modules/'+TK+'/records/'+id);codes[r.s]=(codes[r.s]||0)+1;}
for(const id of C.f06){const r=await api('GET','/modules/'+CON2+'/records/'+id);codes['c'+r.s]=(codes['c'+r.s]||0)+1;}
const v=await api('GET','/modules/'+TK+'/views/'+C.V);codes['v'+v.s]=1;
const q=await api('GET','/modules/'+TK+'/records?limit=50&q='+encodeURIComponent('QA RT21 TK'));const cq=await api('GET','/modules/'+CON2+'/records?limit=50&q='+encodeURIComponent('QA RT21 TK'));
log('GET codes',JSON.stringify(codes),'search live tickets',arr(q.j?.data).length,'contracts',arr(cq.j?.data).length);
const d=await api('GET','/desk/departments/'+C.D);log('fixture dept agents',JSON.stringify(d.j?.data?.agent_user_ids));
LED('cleanup verified: '+JSON.stringify(codes)+'; bin mine left 0 expected; live search 0');
