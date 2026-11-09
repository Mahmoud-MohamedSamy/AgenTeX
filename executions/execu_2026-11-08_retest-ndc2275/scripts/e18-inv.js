module.exports=async()=>{const R={};
 const f=await api('GET','/modules/'+T+'/fields');const F=arr(f.j&&f.j.data&&(f.j.data.fields||f.j.data));
 R.fieldsStatus=f.s;R.timeFields=F.filter(x=>/custom|respon|repl|last|creat|modif|thread|age|activity|date|time/i.test((x.key||x.field_key||x.api_name||x.name||'')+' '+(x.label||''))).map(x=>(x.key||x.field_key||x.api_name||x.name)+' | '+(x.label||'')+' | '+(x.type||x.data_type)+' | ro:'+(x.read_only??x.is_read_only??x.system??''));
 // oldest tickets
 const L=[];for(let p=1;p<=3;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=asc');if(r.s!==200){R.listErr=r.s+' '+r.t;break;}const A=arr(r.j.data);if(!A.length)break;L.push(...A.map(fl));await W(150);}
 const keys=L[0]?Object.keys(L[0]):[];R.recordKeys=keys.join(',');
 const pick=o=>{const x={no:o.ticket_number,created:String(o.created_at||'').slice(0,10),subject:String(o.subject||'').slice(0,40),status:o.status,dept:String(o.department||'').slice(0,8),owner:o.owner?String(o.owner.id||o.owner).slice(0,8):null};for(const k of keys)if(/custom|respon|repl|last/i.test(k))x[k]=o[k];return x;};
 R.oldest=L.filter(o=>String(o.created_at)<'2026-10-10').slice(0,25).map(pick);R.countOld=L.filter(o=>String(o.created_at)<'2026-10-10').length;
 return R;};
