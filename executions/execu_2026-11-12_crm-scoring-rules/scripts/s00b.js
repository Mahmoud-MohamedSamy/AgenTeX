const L=await modId('leads'); const f=await fields(L);
const more=f.filter(x=>['multi_select','date','date_time','decimal','percent','radio_button','user','lookup','url','phone','multi_line'].includes(x.datatypeKey)&&!x.isSystemManaged).map(x=>x.fieldName+':'+x.datatypeKey);
const lst=await api('GET','/modules/'+L+'/records?per_page=1');
const r=arr(lst.j.data)[0]; return {more, keys:r&&Object.keys(r), data:r&&JSON.stringify(r.data||r.fields||r).slice(0,900)};
