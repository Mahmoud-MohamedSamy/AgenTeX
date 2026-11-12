const L=await modId('leads'); const f=await fields(L);
const pick=f.filter(x=>['pick_list','multi_select','checkbox','number','decimal','currency','date','date_time','single_line','email','status','radio_button'].includes(x.datatypeKey)).map(x=>({k:x.fieldName,dt:x.datatypeKey,sys:x.isSystemManaged,req:x.required,opts:(x.datatypeOptions&&JSON.stringify(x.datatypeOptions).slice(0,160))}));
// sample record shape
const lst=await api('GET','/modules/'+L+'/records?per_page=1');
return {fields:pick, rec:lst.t.slice(0,1200)};
