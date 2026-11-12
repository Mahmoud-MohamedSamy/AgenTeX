const L=await modId('leads');
const getF=async(id,f)=>{const d=(await api('GET','/modules/'+L+'/records/'+id)).j.data.data; const e=d.find(x=>x.field===f); return e&&e.value&&(e.value.value??null);};
const b={moduleId:L,appKey:'crm',name:P+'G lat',description:'QA',trigger:{kind:'RecordScoreChanged',scoreChange:'increased'},criteria:null,mode:'Recurring',actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{title:{kind:'string',stringValue:'LAT'}}}],conditions:[],isActive:true};
const x=await api('POST','/workflow/rules',b); const w=x.j.data.id; (I.wfs=I.wfs||[]).push(w); SAVE();
const a=await newRec(L,{no_of_employees:1,title:'-'}); await sleep(20000); log('after create title', await getF(a,'title'));
await upd(L,a,{title:'-'}); await sleep(15000); log('reset', await getF(a,'title'));
const t0=Date.now(); await upd(L,a,{no_of_employees:3}); let v; for(let i=0;i<40;i++){v=await getF(a,'title'); if(v==='LAT')break; await sleep(1500);} log('latency ms', Date.now()-t0, v, 'score', await recScore(L,a));
await api('DELETE','/workflow/rules/'+w); I.latRec=a; SAVE();
