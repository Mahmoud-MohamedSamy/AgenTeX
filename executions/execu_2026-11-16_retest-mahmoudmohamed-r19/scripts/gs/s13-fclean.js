const o={};
o.associateWhenFull=SR(await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:I.fDC,mappings:{X:'Silver',Y:'Silver',Z:'Silver'}}));
let ok=0,bad=[]; for (const [m,f] of I.FF) { const r=await api('DELETE','/modules/'+m+'/fields/'+f); if(r.s<300) ok++; else bad.push(SR(r)); }
LED('deleted '+ok+' QA RT19 GS F* fields (own QA data, Recycle Bin)'); o.delFields=ok; o.bad=bad.slice(0,3);
o.delSet=SR(await api('DELETE','/global-sets/'+I.FS)); LED('deleted set QA RT19 GS Fields '+I.FS+' → '+o.delSet.slice(0,3));
I.FFdeleted=true; SAVE(); return o;
