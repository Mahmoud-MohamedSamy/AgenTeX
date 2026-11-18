const o={};
o.cloneAt30=SR(await api('POST','/global-sets/'+I.T+'/clone',{}));
o.convertAt30=SR(await api('POST','/global-sets/from-field',{module_id:L,field_id:I.fDC,name:'QA RT19 GS conv',description:null}));
let ok=0, bad=[]; for (const id of I.LS) { const r=await api('DELETE','/global-sets/'+id); if(r.s<300) ok++; else bad.push(SR(r)); }
LED('deleted '+ok+' QA RT19 GS Lim sets (own QA data)'); o.deleted=ok; o.bad=bad; I.LSdeleted=true; SAVE();
o.after=arr((await api('GET','/global-sets?limit=200')).j.data).map(x=>x.name).join(' | ');
return o;
