const C=await modId('contacts'); let made=0; for(let i=0;i<50;i++){const r=await mkRule(C,{name:P+'lim '+i,entries:[ent('email','contains','qa'+i,1)]}); if(keepRule(r))made++;}
const L=await modId('leads'); const r=await mkRule(L,{name:P+'K3',entries:[ent('qa_sr1112_k3','contains','x',2)]}); keepRule(r);
const r9=await mkRule(L,{name:P+'K9',entries:[ent('qa_sr1112_k9','eq','secret',6)]}); keepRule(r9);
return {made, k3:r.s, k9:r9.s, contacts:C};
