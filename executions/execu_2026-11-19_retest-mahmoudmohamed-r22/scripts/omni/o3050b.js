const P='/salesiq/people/scoring/rules';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z OMNI: '+m+'\n');
const C={conditions:[{field:'pageurl',value:'qa-rt22-3050',operator:'CONTAINS',connector:'AND'}]};
const keep=(n,r)=>{let id=null;if(r.s<300){id=r.j?.data?.id;if(id)LED('3050 scoring rule '+n+' created '+id+' (delete)');}o[n]=r.s+' '+String(r.t).slice(0,230);return id;};
keep('criteriaEmpty',await api('POST',P,{name:'QA RT22 3050 c-empty',points:5,criteria:{conditions:[]}}));
keep('zeroPoints',await api('POST',P,{name:'QA RT22 3050 zero',points:0,criteria:C}));
keep('noPoints',await api('POST',P,{name:'QA RT22 3050 nopts',criteria:C}));
const id=keep('valid',await api('POST',P,{name:'QA RT22 3050 valid',points:10,criteria:C}));
if(id){o.validGet=JSON.stringify((await api('GET',P+'/'+id)).j?.data||'').slice(0,200);
 const u=await api('PUT',P+'/'+id,{name:'QA RT22 3050 valid',points:10,criteria:{conditions:[]}});o.updateToEmpty=u.s+' '+String(u.t).slice(0,160);
 const u2=await api('PUT',P+'/'+id,{name:'QA RT22 3050 valid',points:0,criteria:C});o.updateToZero=u2.s+' '+String(u2.t).slice(0,160);}
return o;
