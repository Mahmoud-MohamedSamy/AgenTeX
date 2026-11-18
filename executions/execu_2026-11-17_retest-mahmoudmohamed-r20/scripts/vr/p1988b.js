const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b'; const o={};
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data); o.types=[...new Set(F.map(x=>x.datatypeKey))];
const pk=F.find(x=>/pick/.test(x.datatypeKey)&&/^qa_ndc/.test(x.apiName)); o.pickField=JSON.stringify({a:pk.apiName,dto:pk.datatypeOptions,cfg:pk.config}).slice(0,800);
const L=(await api('GET','/modules/'+T+'/layouts/'+STD)).j.data; const fl=[]; for(const s of L.views.CREATE.layout.sections) for(const c of s.columns) for(const f of c.fields) fl.push(f);
const lp=fl.find(f=>/pick/.test(f.datatypeKey)); o.layoutPickKeys=lp&&Object.keys(lp); o.layoutPickCfg=lp&&JSON.stringify({c:lp.config,d:lp.datatypeOptions}).slice(0,600);
o.layoutFieldExtraKeys=[...new Set(fl.flatMap(f=>Object.keys(f)))]; o.cfgKeys=[...new Set(fl.flatMap(f=>Object.keys(f.config||{})))];
const wf=arr((await api('GET','/web-forms')).j.data); o.wf=wf.map(x=>[x.id.slice(0,8),x.kind,x.name]);
const hc=wf.find(x=>x.kind==='help_center_form'); if(hc){ const d=await api('GET','/web-forms/'+hc.id); o.hcKeys=d.j&&Object.keys(d.j.data); o.hcFields=JSON.stringify(d.j.data.fields||d.j.data.config||'').slice(0,1200);}
const lr=arr((await api('GET','/modules/'+T+'/layout-rules')).j.data); o.lr=lr.map(x=>[x.id.slice(0,8),x.name,x.status,x.layoutId.slice(0,8),x.primaryField,JSON.stringify(x.departmentIds),x.applyToHelpCenter]);
o.lrSample=JSON.stringify(lr[0]).slice(0,1500);
return o;
