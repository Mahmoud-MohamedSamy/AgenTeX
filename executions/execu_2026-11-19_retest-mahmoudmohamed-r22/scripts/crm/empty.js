const id=process.env.WF;const g=(await api('GET','/web-forms/'+id)).j?.data;
const r=await api('PUT','/web-forms/'+id,{kind:g.kind,name:g.name,department_id:g.department_id,layout_id:g.layout_id,module_id:g.module_id,app_key:g.app_key,row_version:g.row_version,is_enabled:true,definition:{...g.definition,allowed_origins:[]}},{'If-Match':String(g.row_version)});
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z '+g.app_key+': web form '+g.name+' allowed_origins → [] ('+r.s+')\n');
return r.s+' now='+JSON.stringify((await api('GET','/web-forms/'+id)).j?.data?.definition?.allowed_origins);
