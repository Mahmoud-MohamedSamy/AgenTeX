const o={};
for (const v of ['Gold','Silver','Bronze','Platinum']) { const r=await api('GET','/global-sets/'+I.T+'/values/usage?value='+encodeURIComponent(v)); o['usage_'+v]=r.s+' '+JSON.stringify(r.j&&r.j.data).replace(/"(module_id|field_id|id)":"[^"]+",?/g,'').slice(0,900); }
for (const q of ['?module_id='+L+'&field_name=qa_rt19_gs_tier','?module_id='+L+'&field_name=qa_rt19_gs_tier&value=Gold','?module_id='+L+'&field_name=qa_rt19_gs_tier&value=Bronze']) { const r=await api('GET','/reporting/field-usage'+q); o['rep'+q.slice(-12)]=r.s+' '+r.t.slice(0,500); }
const m1=(await api('GET','/modules/'+L+'/records/'+I.R.LG1)).j.data; o.LG1_modified=m1.lastModifiedAt||m1.last_modified_at||JSON.stringify(m1).match(/"(last_?[mM]odified_?[aA]t)":"([^"]+)/)?.[2];
I.LG1mod=o.LG1_modified; SAVE();
return o;
