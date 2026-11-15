await sleep(3000);
const fl=encodeURIComponent(JSON.stringify([{field:'first_name',operator:'equals',value:'QA RT18 2959 hosted'}]));
const r=await api('GET','/modules/'+L+'/records?page=1&per_page=10&filters='+fl); const rows=arr(r.j.data);
const out={s:r.s,n:rows.length,ids:rows.map(x=>x.id)};
const s=JSON.stringify(rows[0]||{}); out.src=(s.match(/"lead_source","value":\{[^}]*\}/)||[''])[0];
for(const x of rows){ if(!(I.leads2959||[]).includes(x.id)){ (I.leads2959=I.leads2959||[]).push(x.id); LED('lead "QA RT18 2959 hosted" '+x.id+' (Leads, via hosted web form)'); } } SAVE();
const sub=await api('GET','/web-forms/'+I.wf+'/submissions'); out.subs=sub.s+' n='+arr(sub.j&&sub.j.data).length;
return out;
