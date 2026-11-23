for(const p of ['/web-forms?app=crm','/web-forms?app_key=crm','/web-forms']){const r=await api('GET',p);log(p,r.s,r.t.slice(0,300).replace(/fw1\.[\w.-]+/g,'<key>'));}
