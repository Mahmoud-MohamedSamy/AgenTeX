const w=(await api('GET','/workflow/rules/'+I.W)).j.data; const recs=fs.readFileSync(RUN+'/ledger.md','utf8').match(/record K5[ab] Gold ([0-9a-f-]{36})/g).map(x=>x.split(' ').pop());
const vals=[]; for(const id of recs) vals.push(await recVal(L,id,'qa_gs1111_tier'));
return {crit:w.criteria&&w.criteria.value&&w.criteria.value.stringValue, op:w.criteria&&w.criteria.operator, active:w.isActive, trigger:w.trigger&&w.trigger.kind, action:JSON.stringify(w.actions[0].fieldUpdates).slice(0,120), vals};
