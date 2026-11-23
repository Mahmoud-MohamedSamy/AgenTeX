const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b'; const o={};
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data); o.nf=F.length; o.fieldKeys=Object.keys(F[0]); o.sample=JSON.stringify(F.find(x=>x.type==='picklist'||/pick/i.test(x.type||x.fieldType||''))||F[0]).slice(0,1500);
o.flags=F.filter(x=>JSON.stringify(x).match(/encrypt|ephi|phi|helpCenter|help_center/i)).map(x=>[x.apiName||x.api_name||x.key, (JSON.stringify(x).match(/"[^"]*(encrypt|ephi|phi|elpCenter|elp_center)[^"]*":[^,}]*/gi)||[]).join(' ')]).slice(0,15);
const L=(await api('GET','/modules/'+T+'/layouts/'+STD)).j.data; o.layoutKeys=Object.keys(L); o.viewKeys=L.views&&Object.keys(L.views); o.layoutStr=JSON.stringify(L).length;
const cv=L.views&&(L.views.CREATE||Object.values(L.views)[0]); o.cvKeys=cv&&Object.keys(cv); o.cvSample=JSON.stringify(cv).slice(0,1200);
o.deps=JSON.stringify(L.dependencies||null).slice(0,600);
for (const p of ['/modules/'+T+'/layout-rules','/modules/'+T+'/map-dependencies','/modules/'+T+'/field-dependencies','/modules/'+T+'/dependencies','/desk/web-forms','/web-forms','/desk/help-center/forms','/modules/'+T+'/layouts/'+STD+'/dependencies']) { const r=await api('GET',p); o['GET '+p]=r.s+' '+(r.s===200?JSON.stringify(arr(r.j.data).length)+' '+r.t.slice(0,300):''); }
return o;
