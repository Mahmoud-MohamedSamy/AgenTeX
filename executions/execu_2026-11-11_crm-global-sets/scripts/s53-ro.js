const o={}; const l=await api('GET','/global-sets'); o.list=SR(l)+' count '+arr(l.j&&l.j.data).length; const id=arr(l.j&&l.j.data)[0]&&arr(l.j.data)[0].id;
o.get=SR(await api('GET','/global-sets/'+I.M)); o.usedIn=SR(await api('GET','/global-sets/'+I.M+'/used-in'));
o.create=SR(await api('POST','/global-sets',{name:'QA GS1111 RO',values:[{label:'A'}]})); o.clone=SR(await api('POST','/global-sets/'+I.M+'/clone')); o.replace=SR(await api('POST','/global-sets/'+I.M+'/values/replace',{replacements:{B:'A'}})); o.remove=SR(await api('POST','/global-sets/'+I.M+'/values/remove',{values:['A']})); o.del=SR(await api('DELETE','/global-sets/'+I.M));
const ok=/^200/.test(o.list)&&/^200/.test(o.get)&&['create','clone','replace','remove','del'].every(k=>/^403/.test(o[k]));
RES('A10', ok?'Pass':'Fail','CRM User with crm:global_set:view only: '+JSON.stringify(o));
return o;
