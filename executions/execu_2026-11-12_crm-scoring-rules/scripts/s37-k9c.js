const L=await modId('leads'); const g=await api('GET','/modules/'+L+'/records/'+I.k9rec); const s=g.t;
const hasK9=/qa_sr1112_k9/.test(s), secret=/"secret"/.test(s); const sc=await recScore(L,I.k9rec);
// edit as low user: change a visible field, score must stay 6 (hidden value still counted)
const u=await api('PATCH','/modules/'+L+'/records/'+I.k9rec,recBody({title:'low edit'})); const sc2=await recScore(L,I.k9rec);
return {get:g.s, k9FieldVisible:hasK9, secretVisible:secret, score:sc, editByLow:u.s, scoreAfterLowEdit:sc2};
