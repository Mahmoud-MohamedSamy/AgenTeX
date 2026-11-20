const id=JSON.parse(fs.readFileSync('../out/wfB.json','utf8')).id;const g=(await api('GET','/web-forms/'+id)).j?.data;
const r=await api('PUT','/web-forms/'+id,{kind:g.kind,name:g.name,department_id:g.department_id,layout_id:g.layout_id,module_id:g.module_id,app_key:'crm',row_version:g.row_version,is_enabled:true,definition:{...g.definition,language:'ar'}},{'If-Match':String(g.row_version)});
return r.s+' lang='+((await api('GET','/web-forms/'+id)).j?.data?.definition?.language)+' '+(r.s>=300?String(r.t).slice(0,300):'');
