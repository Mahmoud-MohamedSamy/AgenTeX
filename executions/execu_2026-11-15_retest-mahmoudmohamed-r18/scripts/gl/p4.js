const o={}; const r=await api('GET','/web-forms'); o.forms=arr(r.j.data).map(f=>[f.id,f.name,f.is_enabled,f.language||f.locale,f.department_id,f.embed_key||f.public_key||f.key]); o.lim=(await api('GET','/web-forms/limits')).t.slice(0,300);
o.one=JSON.stringify(arr(r.j.data)[0]).slice(0,2500);
return o;
