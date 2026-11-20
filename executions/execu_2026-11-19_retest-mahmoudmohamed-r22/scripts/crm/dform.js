const did=fs.readFileSync('../out/wf-ids.txt','utf8').split(' ')[0];const g=(await api('GET','/web-forms/'+did)).j?.data;
const r=await api('POST','/web-forms?app=desk',{kind:g.kind,name:'QA RT22 2751 desk empty',department_id:g.department_id,layout_id:g.layout_id,module_id:g.module_id,app_key:'desk',definition:{...g.definition,success_message:'QA RT22 desk empty thank you',allowed_origins:[]}});
if(r.s<300){fs.appendFileSync('../ledger.md','- DESK: created web form QA RT22 2751 desk empty '+r.j.data.id+' (delete)\n');fs.writeFileSync('../out/wfDE.json',JSON.stringify(r.j.data,null,1));}
return r.s+' '+(r.s<300?'origins='+JSON.stringify(r.j.data.definition.allowed_origins):String(r.t).slice(0,300));
