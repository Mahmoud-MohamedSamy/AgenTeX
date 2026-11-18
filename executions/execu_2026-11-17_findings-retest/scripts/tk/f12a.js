C.bulk=C.bulk||[];const N=25;let i=C.bulk.length;
while(i<N){const batch=[];for(let k=0;k<5&&i<N;k++,i++)batch.push(mkT('F12 bulk '+String(i+1).padStart(2,'0')));const rs=await Promise.all(batch);for(const r of rs){if(r.id)C.bulk.push(r.id);else log('err',r.err);}saveC();}
LED('25 tickets created "QA RT21 TK F12 bulk 01..25" in QA RT20 TK Dept (fixture) (ids in scripts/tk/cfg.json bulk)');
if(!C.V){const r=await api('POST','/modules/'+TK+'/views',{name:'QA RT21 TK F12 view',kind:'list',layout_id:null,visibility:'private',settings:{columns:['subject','status','priority'],sort:null,criteria:{pattern:null,conditions:[{field:'subject',operator:'starts_with',value:'QA RT21 TK F12'}]},related_criteria:[]}});log('view',E(r));if(r.j?.data?.id){C.V=r.j.data.id;saveC();LED('view "QA RT21 TK F12 view" '+C.V+' created (private, subject starts with QA RT21 TK F12)');}}
log('made',C.bulk.length);
