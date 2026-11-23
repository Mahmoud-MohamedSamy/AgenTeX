const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/';
const E=r=>r.s+(r.s>=300?' '+String(r.t).replace(/fw1\.[\w.-]+/g,'<key>').slice(0,500):'');
const g=(await api('GET','/web-forms/dfff0af0-a0aa-45b2-8b46-3b3aaa187a3c')).j?.data;const o={src:g?.name};
const body={kind:g.kind,name:'QA RT24 3138 desk empty',department_id:g.department_id,layout_id:g.layout_id,module_id:g.module_id,app_key:'desk',definition:{...g.definition,success_message:'QA RT24 3138 desk thank you',allowed_origins:[],share_link_enabled:true}};
const r=await api('POST','/web-forms',body);o.desk=E(r);if(r.j?.data){fs.writeFileSync(OUT+'wf3138desk.json',JSON.stringify(r.j.data,null,1));o.deskId=r.j.data.id;o.fields=(r.j.data.definition.fields||[]).map(f=>f.key+(f.required?'*':''));}
log(o);
