const me=await api('GET','/iam/me'); const who=me.j&&me.j.data; const perms=JSON.stringify(who||{}).match(/crm:global_set:[a-z]+/g);
const l=await api('GET','/global-sets'); const c=await api('POST','/global-sets',{name:'QA GS1111 LowUser',values:[{label:'A'}]}); if(c.s<300)LED('set by low user '+c.j.data.id);
const g=await api('GET','/global-sets/'+I.T); const p=await api('PUT','/global-sets/'+I.T,{name:'QA GS1111 Tier',values:[{label:'X'}],row_version:1}); const dl=await api('DELETE','/global-sets/'+I.T); const rp=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Gold:'Silver'}}); const cl=await api('POST','/global-sets/'+I.T+'/clone');
if(cl.s<300)LED('clone by low user '+cl.j.data.id);
const prof=who&&(who.profiles||who.profile||who.roles); 
RES('A6','Info','Mahmoud Samy (CRM User) profile '+JSON.stringify(prof).slice(0,120)+'; perms in /iam/me: '+perms+'; GET list → '+SR(l));
RES('A3', c.s===403?'Pass':'Fail','low user create → '+SR(c));
RES('A4', [p.s,dl.s,rp.s,cl.s].every(s=>s===403)?'Pass':'Fail','low user PUT '+p.s+', DELETE '+dl.s+', replace '+rp.s+', clone '+cl.s);
return {get:g.s};
