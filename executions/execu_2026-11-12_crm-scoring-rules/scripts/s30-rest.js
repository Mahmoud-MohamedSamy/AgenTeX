const L=await modId('leads'); await delAllQA();
const mkF=async(mod,name,type,label)=>{const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:label},datatypeKey:type,datatypeOptions:{},config:{}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id){(I.fields=I.fields||[]).push([mod,id]);SAVE();} else log('mkF fail',name,SR(r).slice(0,200)); return id;};
// K3 rename label
const k3=await mkF(L,'qa_sr1112_k3','single_line','QA K3 Old'); let r=await mkRule(L,{name:P+'K3',entries:[ent('qa_sr1112_k3','contains','x',2)]}); const k3r=keepRule(r);
const f=(await fields(L)).find(x=>x.id===k3); let rn=await api('PUT','/modules/'+L+'/fields/'+k3,{...f,labels:{en:'QA K3 New'}}); if(rn.s>=400) rn=await api('PATCH','/modules/'+L+'/fields/'+k3,{labels:{en:'QA K3 New'},rowVersion:f.rowVersion});
const f2=(await fields(L)).find(x=>x.id===k3); const k3rec=await newRec(L,{qa_sr1112_k3:'xyz'}); const k3s=await recScore(L,k3rec); const g=(await api('GET','/scoring-rules/'+k3r)).j.data;
RES('K3',(f2.labels.en==='QA K3 New'&&k3s===2&&g.entries[0].field_key==='qa_sr1112_k3')?'pass':'fail','rename label '+rn.s+' -> "'+f2.labels.en+'"; rule still keyed qa_sr1112_k3; record with "xyz" scores '+k3s+' (drawer label checked in UI)');
I.k3rule=k3r; SAVE();
// K7 merge
r=await mkRule(L,{name:P+'K7',entries:[ent('lead_source','eq','web',10),ent('industry','eq','technology',5)]}); keepRule(r);
const ma=await newRec(L,{lead_source:'web'}), mb=await newRec(L,{industry:'technology'}); const sa=await recScore(L,ma), sb=await recScore(L,mb);
const pv=await api('POST','/modules/'+L+'/records/'+ma+'/merge/preview',{duplicate_ids:[mb]});
const mg=await api('POST','/modules/'+L+'/records/'+ma+'/merge',{duplicate_ids:[mb]}); await sleep(2000);
const d=(await api('GET','/modules/'+L+'/records/'+ma)).j.data.data; const gv=k=>{const e=d.find(y=>y.field===k);return e&&e.value&&e.value.value;};
const ms=await recScore(L,ma); const exp=(gv('lead_source')==='web'?10:0)+(gv('industry')==='technology'?5:0);
RES('K7',(mg.s<300&&ms===exp)?'pass':'fail','A web (score '+sa+') + B technology (score '+sb+'); merge '+SR(mg).slice(0,120)+'; merged lead_source='+gv('lead_source')+', industry='+gv('industry')+', score '+ms+' (expected from merged values '+exp+')');
// F5 export
const ex=await api('GET','/modules/'+L+'/records/export?format=csv&scope=all&lang=en'); const hdr=(ex.t||'').split(/\r?\n/)[0];
const hasScore=/(^|,)"?Score"?(,|$)/.test(hdr); const row=(ex.t||'').split(/\r?\n/).find(l=>l.includes('QA SR1112'));
RES('F5',(ex.s===200&&hasScore)?'pass':(ex.s===200?'fail':'blocked'),'export csv '+ex.s+'; header has Score: '+hasScore+'; header starts '+hdr.slice(0,160)+(row?'; a QA row: '+row.slice(0,140):''));
// K9 hidden field for the CRM User profile
const k9=await mkF(L,'qa_sr1112_k9','single_line','QA K9 Secret');
const fpp=await api('POST','/modules/'+L+'/field-permissions',{fieldId:k9,profileId:'44444444-4444-4444-4444-444444444401',permission:'hidden'}); log('fp post',SR(fpp).slice(0,200));
r=await mkRule(L,{name:P+'K9',entries:[ent('qa_sr1112_k9','eq','secret',6)]}); keepRule(r);
const k9rec=await newRec(L,{qa_sr1112_k9:'secret'}); const k9s=await recScore(L,k9rec); I.k9rec=k9rec; I.k9fp=fpp.j&&fpp.j.data&&fpp.j.data.id; SAVE();
log('K9 owner score',k9s);
// L3 500 records mass update
await delAllQA(); r=await mkRule(L,{name:P+'L3',entries:[ent('lead_source','eq','web',10)]}); keepRule(r);
const ids=[]; for(let i=0;i<5;i++){const recs=Array.from({length:100},(_,j)=>recBody({first_name:P+'L3 '+(i*100+j),lead_source:'chat'})); const b=await api('POST','/modules/'+L+'/records/bulk',{records:recs}); const got=arr(b.j&&b.j.data); got.forEach(x=>{const id=x.id||(x.record&&x.record.id); if(id){ids.push(id);(I.recs=I.recs||[]).push([L,id]);}}); if(!got.length) log('bulk',SR(b).slice(0,200));}
SAVE(); const t0=Date.now(); const mu=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids,data:[{field:'lead_source',value:{kind:'string',value:'web'}}]}); const dt=Date.now()-t0;
await sleep(5000); let ok=0,bad=[]; for(let i=0;i<ids.length;i+=10){const ss=await Promise.all(ids.slice(i,i+10).map(id=>recScore(L,id))); ss.forEach((s,k)=>{if(s===10)ok++; else if(bad.length<5)bad.push(ids[i+k].slice(0,8)+'='+s);});}
RES('L3',(mu.s<300&&ok===ids.length&&ids.length===500)?'pass':'fail','bulk-created '+ids.length+' chat leads; mass update to web '+SR(mu).slice(0,120)+' in '+dt+' ms; scored 10: '+ok+'/'+ids.length+(bad.length?' e.g. '+bad.join(','):''));
SAVE();
