const [g,s,b]=I.R2; const tries=[];
let r=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[g,s],data:[{field:'qa_gs1111_r2',value:enc('Silver')}]}); tries.push('list form → '+SR(r));
if(r.s>=300){ r=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[g,s],data:{qa_gs1111_r2:enc('Silver')}}); tries.push('map form → '+SR(r)); }
const v1=[await recVal(L,g,'qa_gs1111_r2'),await recVal(L,s,'qa_gs1111_r2')];
const shape=tries[tries.length-1].startsWith('map')?(v=>({qa_gs1111_r2:enc(v)})):(v=>[{field:'qa_gs1111_r2',value:enc(v)}]);
const ru=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[g],data:shape('Bronze')}); const rx=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[g],data:shape('Nope')});
const v2=await recVal(L,g,'qa_gs1111_r2');
RES('K3', v1.every(x=>x==='Silver')&&ru.s>=400&&rx.s>=400?'Pass':'Fail', 'mass update 2 leads to Silver: '+tries.join('; ')+' → '+v1+'; to unused Bronze → '+SR(ru)+'; to "Nope" → '+SR(rx)+'; lead now '+v2);
await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[g],data:shape('Gold')});
const bs=await api('GET','/modules/'+L+'/records/board-summary?group_by=qa_gs1111_r2'); const cols=JSON.stringify(bs.j&&bs.j.data).slice(0,700);
fs.writeFileSync(RUN+'/out/board-summary.json',JSON.stringify(bs.j,null,1));
RES('K6', bs.s===200?'Info':'Fail','board summary grouped by the set field → '+SR(bs)+' '+cols);
return 'ok';
