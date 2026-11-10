const out={};const S=v=>({kind:'string',value:v});
const prof=async()=>arr((await api('GET','/iam/users?search=Mahmoud%20Samy')).j.data).filter(u=>u.userId===SAMY).map(u=>u.profileNames)[0];
out.before=await prof();
if(!ids.samyProfChanged){const r=await api('POST',`/iam/users/${SAMY}/profiles`,{profile_id:SUPV,replace:true});out.assign=r.s+' '+r.t.slice(0,200);
 if(r.s<300){ids.samyProfChanged=true;save();log(`SETTING Mahmoud Samy CRM profile User → Supervisor (replace:true) ${r.s}; ORIGINAL profiles "${out.before}" — restore User`);}}
out.after=await prof();
const mk=[['LA',ids.userA,'owned by QA SS A (Sales/Team 2, sub-unit)'],['LB',ids.userB,'owned by QA SS B (HR, sibling unit)'],['LC',ids.userC,'owned by QA SS C (Sales, same unit)'],['LO',null,'owned by ndc-staging-owner (higher rank)']];
for(const [k,own,why] of mk){if(ids[k])continue;const d=[{field:'first_name',value:S('QA SS 2417 '+k)},{field:'single_line_3_9',value:S('QA')}];if(own)d.push({field:'owner',value:S(own)});
 const r=await api('POST',`/modules/${LEADS}/records`,{data:d});const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);out[k]=r.s+' '+(id||r.t.slice(0,250));
 if(id){ids[k]=id;save();log(`CREATED lead "QA SS 2417 ${k}" ${id} ${why}`);}}
// read back owners
for(const k of ['LA','LB','LC','LO']){if(!ids[k])continue;const r=await api('GET',`/modules/${LEADS}/records/${ids[k]}`);const d=r.j&&r.j.data&&r.j.data.data||[];const ow=(Array.isArray(d)?d.find(x=>x.field==='owner'):d.owner);out['own'+k]=JSON.stringify(ow&&(ow.value||ow)).slice(0,80);}
return out;
