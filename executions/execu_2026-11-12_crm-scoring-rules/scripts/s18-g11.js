const L=await modId('leads');
const a=await newRec(L,{lead_source:'chat',title:'-'}); await sleep(12000);
await upd(L,a,{rating:'active',lead_source:'web'}); await sleep(25000);
const d=(await api('GET','/modules/'+L+'/records/'+a)).j.data.data; const gv=f=>{const e=d.find(y=>y.field===f);return e&&e.value&&e.value.value;};
const b=await newRec(L,{lead_source:'chat',title:'-'}); await sleep(12000); await upd(L,b,{rating:'active'}); await sleep(25000);
const d2=(await api('GET','/modules/'+L+'/records/'+b)).j.data.data; const t2=(d2.find(y=>y.field==='title')||{}).value;
RES('G11',gv('title')==='CRIT13'&&t2&&t2.value!=='CRIT13'?'pass':'fail','user edit to score 13 -> title='+gv('title')+' (score '+(await recScore(L,a))+'); control edit to score 3 then wf raises to 13 -> title='+(t2&&t2.value));
