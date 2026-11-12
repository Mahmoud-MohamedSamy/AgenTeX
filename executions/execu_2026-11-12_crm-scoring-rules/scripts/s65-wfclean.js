const L=await modId('leads'); const o={rules:await delAllQA()};
for(const id of (I.wfLeads||[])) o['lead']=(await api('DELETE','/modules/'+L+'/records/'+id)).s;
const g=await api('GET','/web-forms/'+I.webform); const rv=g.j&&g.j.data&&g.j.data.row_version;
let d=await api('DELETE','/web-forms/'+I.webform); if(d.s>=400) d=await api('DELETE','/web-forms/'+I.webform+'?row_version='+rv); o.form=d.s+' '+(d.s>=400?d.t.slice(0,150):'');
o.formsLeft=arr((await api('GET','/web-forms?app=crm')).j.data).length; return o;
