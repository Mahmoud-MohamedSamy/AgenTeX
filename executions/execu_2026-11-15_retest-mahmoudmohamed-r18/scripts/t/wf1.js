const o={};
for (const app of ['crm']) { const forms=arr((await api('GET','/web-forms')).j.data); o.n=forms.length;
 o.forms=forms.map(f=>({id:f.id,name:f.name,kind:f.kind,app:f.app_key,en:f.is_enabled,key:f.embed_key?('len'+f.embed_key.length):null, keys:Object.keys(f).join(',').slice(0,300)}));
 if(forms[0]){ const g=await api('GET','/web-forms/'+forms[0].id); const d=g.j.data; o.snip=JSON.stringify(d.snippets||{}).replace(/[A-Za-z0-9_-]{20,}/g,'<k>').slice(0,1500); o.settings=JSON.stringify(d.settings||d.config||{}).slice(0,600);}
}
return o;
