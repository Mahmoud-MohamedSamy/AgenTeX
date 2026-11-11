const mod=async id=>{const d=(await api('GET','/modules/'+L+'/records/'+id)).j; return d&&d.data&&(d.data.lastModifiedAt||d.data.last_modified_at||d.data.updated_at||JSON.stringify(d.data).match(/"(last_?[mM]odified_?[aA]t|modified_time)":"([^"]+)/)?.[2]);};
// G1 Gold used only by records (L3) -> Bronze
const before=await mod(I.L3); let r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Gold:'Bronze'}}); await sleep(3000);
let g=await gs(I.T); const l3=await recVal(L,I.L3,'qa_gs1111_tier'); const after=await mod(I.L3);
RES('G1', r.s===200&&l3==='Bronze'&&g.unused_values.some(v=>v.value==='Gold')?'Pass':'Fail', SR(r)+' L3='+l3+'; Gold in unused='+g.unused_values.some(v=>v.value==='Gold')+'; modified '+before+' → '+after);
fs.writeFileSync(RUN+'/out/g1.json',JSON.stringify({r:r.j},null,1));
// G2 Silver (view + rule action + L1 + C1) -> Bronze
r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Silver:'Bronze'}}); await sleep(2000);
const l1=await recVal(L,I.L1,'qa_gs1111_tier'), c1=await recVal(I.C,I.C1,'qa_gs1111_tier'); const v=(await api('GET','/modules/'+L+'/views/'+I.V)).j.data.settings.criteria; const w=(await api('GET','/workflow/rules/'+I.W)).j.data;
RES('G2', r.s===200&&JSON.stringify(v).includes('Bronze')?'Pass':'Fail', 'replace Silver→Bronze (used by Silver view filter, rule action, L1, C1) → '+SR(r)+'; L1='+l1+' C1='+c1+'; view criteria '+JSON.stringify(v.conditions)+'. Zoho: replaced everywhere (records, criteria, workflow actions, dependency).');
RES('G3', /Bronze/.test(JSON.stringify(w.actions[0].fieldUpdates))?'Pass':'Fail', 'rule action after replace attempt: '+w.actions[0].fieldUpdates.qa_gs1111_tier.stringValue+'; rule criteria '+w.criteria.value.stringValue);
// G2b: replace value used only by the workflow (field update) -> make a value used only by the rule action: change rule action to Bronze? Instead test rule criteria value Bronze -> replace Bronze -> Gold after restoring Gold
await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Gold']});
r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Bronze:'Gold'}}); await sleep(2000); const w2=(await api('GET','/workflow/rules/'+I.W)).j.data; const l2=await recVal(L,I.L2,'qa_gs1111_tier'), l3b=await recVal(L,I.L3,'qa_gs1111_tier');
RES('G3b', r.s===200&&w2.criteria.value.stringValue==='Gold'?'Pass':'Fail', 'replace Bronze→Gold where Bronze is in the rule criteria (not in a view) → '+SR(r)+'; rule criteria now '+w2.criteria.value.stringValue+'; L2='+l2+' L3='+l3b+'. Zoho: criteria follow the new value.');
// G5 negatives
const neg=[]; for (const [k,b] of [['same value',{Gold:'Gold'}],['from unused',{Platinum:'Gold'}],['to missing',{Gold:'Nope'}],['from missing',{Nope:'Gold'}]]) { const x=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:b}); neg.push(k+'→'+SR(x)); }
RES('G5', neg.every(x=>/→4/.test(x))?'Pass':'Fail', neg.join('; '));
g=await gs(I.T); return g.values.map(v=>v.value+'='+v.label).join(', ')+' | unused '+g.unused_values.map(v=>v.value);
