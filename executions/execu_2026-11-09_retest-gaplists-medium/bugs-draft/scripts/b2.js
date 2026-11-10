const r=await api('GET','/modules');const m=arr(r.j);const out={k:Object.keys(m[0]||{}).join(','),n:m.length};
out.list=m.map(x=>[x.id,x.apiName||x.api_name||x.name||x.singularLabel||x.label,x.app||x.appKey||''].join(' ')).filter(s=>/contact|task|call|event|ticket/i.test(s));
const c=m.find(x=>/^43004ce2/.test(x.id));if(c){const f=arr((await api('GET','/modules/'+c.id+'/fields')).j);out.contactFields=f.filter(z=>/mail|name|depart/i.test(JSON.stringify([z.api_name,z.apiName,z.label]))).map(z=>[z.api_name||z.apiName,z.data_type||z.dataType||z.type,z.required||z.is_required].join(':'));}
const t=arr((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields')).j);out.ticketFields=t.filter(z=>/contact|mail|depart|status|subject/i.test(JSON.stringify([z.api_name,z.apiName]))).map(z=>[z.api_name||z.apiName,z.data_type||z.dataType||z.type].join(':'));
return out;
