C.bulk2=C.bulk2||[];const N=25;let i=C.bulk2.length;
while(i<N){const batch=[];for(let k=0;k<5&&i<N;k++,i++)batch.push(mkT('F12 bulk r2 '+String(i+1).padStart(2,'0')));const rs=await Promise.all(batch);for(const r of rs){if(r.id)C.bulk2.push(r.id);else log('err',r.err);}saveC();}
LED('25 tickets created "QA RT21 TK F12 bulk r2 01..25" in QA RT20 TK Dept (repeat run; ids in cfg bulk2)');log('made',C.bulk2.length);
