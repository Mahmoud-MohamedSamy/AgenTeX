const o={};
const mkF=async(mod,name,dto,label)=>{ const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:label},datatypeKey:dto.type||'pick_list',datatypeOptions:dto.o,config:dto.c||{}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id) LED('field '+name+' on '+(mod===L?'Leads':'Contacts')+' '+id); return {s:r.s,id,e:E(r),raw:id?undefined:r.t.slice(0,300)}; };
o.fL = await mkF(L,'qa_gs1111_tier',{o:{global_set_id:I.T}},'QA GS1111 Tier'); I.fL=o.fL.id;
o.fC = await mkF(I.C,'qa_gs1111_tier',{o:{global_set_id:I.T}},'QA GS1111 Tier'); I.fC=o.fC.id;
o.fLocal = await mkF(L,'qa_gs1111_local',{o:{allowed_values:['Gold','Platinum','Silver']},c:{allowed_values:['Gold','Platinum','Silver']}},'QA GS1111 Local'); I.fLocal=o.fLocal.id;
SAVE();
if (I.fL) { const f=await fieldOf(L,I.fL); o.fLdto=f.datatypeOptions; }
return o;
