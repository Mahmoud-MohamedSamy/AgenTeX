const mine=new Set(C.bulk);let all=[],cur=null;const seen=new Set();
for(let p=0;p<60;p++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){log('list '+r.s+' '+r.t.slice(0,200));break;}const a=arr(r.j&&r.j.data);let f=0;for(const x of a){if(!seen.has(x.id)){seen.add(x.id);all.push(x);f++;}}cur=r.j?.meta?.next_cursor;if(!cur||!f)break;}
const pick=all.filter(x=>mine.has(x.record_id));const groups={};for(const x of pick){const g=x.deletion_group_id||x.group_id||'?';groups[g]=(groups[g]||0)+1;}
let live=0,codes={};for(const id of C.bulk){const r=await api('GET','/modules/'+TK+'/records/'+id);codes[r.s]=(codes[r.s]||0)+1;if(r.s===200)live++;}
if(pick[0])log('keys',Object.keys(pick[0]).join(','),JSON.stringify(pick[0]).slice(0,400));
log('bin items scanned',all.length,'mine in bin',pick.length,'groups',JSON.stringify(groups),'GET codes',JSON.stringify(codes));
LED('NDC-3055: 300 "QA RT21 TK 3055 bulk" tickets deleted via UI Select all → recycle bin (group c313bb05), left in bin');
