const U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729';const d=await api('DELETE','/iam/users/'+U1);
const l=await api('GET','/iam/users?limit=200');const ul=l.j?.data?.data||l.j?.data||l.j?.items||[];const still=Array.isArray(ul)?ul.some(x=>(x.id||x.user_id)===U1):'list '+l.s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-51 cleanup (user OK): "Test SL-51" removed from Desk via Reassign and remove (Customer Support ticket left unassigned); DELETE user '+d.s+'; policy QA AO SL51dobcy already gone (404).\n');
return {del:d.s+' '+d.t.slice(0,200),stillListed:still};
