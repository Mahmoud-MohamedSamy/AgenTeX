// Jam 210917b0 (Tech department threshold 90). READ-ONLY: prefs, agent workloads, recent Tech tickets and their assignment history.
module.exports=async()=>{const R={};const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';
 const AG={QT:'e82f62cb-9904-42c7-a13c-77a7449820b9',DT:'5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4',MT:'23f0f9d7-2fc0-429b-9334-9933fe5c429b',TU1:'876ce871-2b02-4854-89a7-68050391c62b'};
 const p=await api('GET','/desk/departments/'+TECH+'/round-robin-preferences');R.prefsNow=p.j&&p.j.data;
 R.workload={};for(const [k,id] of Object.entries(AG)){const w=await api('GET','/desk/agents/'+id+'/workload');R.workload[k]={s:w.s,d:w.t.slice(0,900)};}
 // open tickets per owner: all departments vs Tech
 const all=[];for(let pg=1;pg<15;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&per_page=100&sort_by=created_at&sort_dir=desc');if(r.s!==200){R.listErr=r.s;break;}const L=arr(r.j.data);if(!L.length)break;for(const x of L)all.push(fl(x));await W(150);}
 R.fieldKeys=all[0]?Object.keys(all[0]).join(','):'';R.scanned=all.length;
 const cnt={};for(const t of all){const o=String(t.owner_id||t.ticket_owner||t.owner||'');const k=Object.entries(AG).find(([,v])=>o.includes(v));if(!k)continue;const st=String(t.status||t.status_type||'').toLowerCase();const c=cnt[k[0]]=cnt[k[0]]||{};c['status:'+st]=(c['status:'+st]||0)+1;const d=String(t.department_id||t.department||'');if(d.includes(TECH))c['tech:'+st]=(c['tech:'+st]||0)+1;}
 R.counts=cnt;
 const recent=all.filter(t=>{const n=+t.ticket_number;return n>=2240&&n<=2290;}).map(t=>({no:t.ticket_number,c:String(t.created_at).slice(11,19),own:Object.entries(AG).find(([,v])=>String(t.owner_id||t.ticket_owner||'').includes(v))?.[0]||String(t.owner_id||'').slice(0,8),dept:String(t.department_id||'').slice(0,8),st:t.status,id:t.id}));R.recent=recent.map(x=>({...x,id:undefined}));
 R.hist={};for(const t of recent.filter(x=>[2263,2279,2280,2281,2282].includes(+x.no))){const a=await api('GET','/desk/tickets/'+t.id+'/activity');R.hist[t.no]=a.s+' '+a.t.slice(0,1500);}
 return R;};
