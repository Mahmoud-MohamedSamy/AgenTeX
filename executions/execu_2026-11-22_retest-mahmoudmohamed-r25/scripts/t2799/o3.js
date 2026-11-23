const TK='88e8ea44-1658-4df3-9930-d0902b91073d',OW='97be04b6-0a08-4883-aa51-e1650b11cab7';const M=JSON.parse(fs.readFileSync('../out/2799-made.json','utf8'));const o={};
for(const [k,t] of Object.entries(M.t)){const r=await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:OW});if(r.s>=300)o[k+'_err']=r.t.slice(0,250);
 const d=(await api('GET','/modules/'+TK+'/records/'+t.id)).j?.data?.data||[];const g=f=>(d.find(x=>x.field===f)||{}).value?.value;
 const bs=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;
 o[k]=[t.num,r.s,g('owner')===OW?'owner OK':'owner '+g('owner'),g('status'),bs];}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z 2799: owner of #6252-#6258 set to ndc-staging-owner (user request)\n');
return o;
