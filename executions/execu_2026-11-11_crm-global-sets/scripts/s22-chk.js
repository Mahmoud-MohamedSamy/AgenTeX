const l=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; const fl=arr((await api('GET','/modules/'+L+'/fields')).j.data);
return {layoutRv:l.rowVersion, hasNew:JSON.stringify(l).includes('qa_gs1111_new'), field:!!fl.find(x=>/qa_gs1111_new/.test(x.fieldName))};
