C.bulk=C.bulk||[];const N=300;let i=C.bulk.length;const t0=Date.now();
while(i<N){const batch=[];for(let k=0;k<6&&i<N;k++,i++)batch.push(mkT('3055 bulk '+String(i+1).padStart(3,'0')));const rs=await Promise.all(batch);for(const r of rs){if(r.id)C.bulk.push(r.id);else log('err',r.err);}saveC();}
LED('300 tickets created "QA RT20 TK 3055 bulk 001..300" in QA RT20 TK Dept (ids in scripts/tk/cfg.json bulk)');
if(!C.V){const r=await api('POST','/modules/'+TK+'/views',{name:'QA RT20 TK 3055 view',kind:'list',layout_id:null,visibility:'private',settings:{columns:['subject','status','priority'],sort:null,criteria:{pattern:null,conditions:[{field:'subject',operator:'starts_with',value:'QA RT20 TK 3055'}]},related_criteria:[]}});log('view',E(r));if(r.j?.data?.id){C.V=r.j.data.id;saveC();LED('view "QA RT20 TK 3055 view" '+C.V+' created (private, subject starts with QA RT20 TK 3055)');}}
log('made',C.bulk.length,'secs',(Date.now()-t0)/1000);
