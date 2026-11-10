// read-only: contact C details + Tech dept + department form fields
const c=await api('GET',`/modules/${CT}/records/${C}`);out.contact=c.s+' '+JSON.stringify(((c.j&&c.j.data&&c.j.data.data)||[]).filter(z=>/name|email/.test(z.field)).map(z=>z.field+'='+JSON.stringify(z.value&&z.value.value)));
const d=await api('GET','/desk/departments/'+TECH);const x=d.j&&(d.j.data||d.j);out.tech={s:d.s,visibility:x&&x.visibility,emails:x&&x.email_addresses,channels:x&&x.channels,cc:x&&x.cc_enabled};
const all=arr((await api('GET','/desk/departments')).j);const v={};all.forEach(z=>v[z.visibility]=(v[z.visibility]||0)+1);out.visibilityCounts=v;
return out;
