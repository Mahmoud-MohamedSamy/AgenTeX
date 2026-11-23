const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/';
const src=JSON.parse(fs.readFileSync(OUT+'wf-crm-def.json','utf8'));const F=(key,req,validation,x={})=>({key,placeholder:null,label:null,required:!!req,hidden:false,default_value:null,help:null,validation:validation||null,...x});
const LAY='6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';const E=r=>r.s+(r.s>=300?' '+String(r.t).replace(/fw1\.[\w.-]+/g,'<key>').slice(0,500):'');
const mk=(name,fields,att)=>({kind:'advanced_form',name,department_id:null,layout_id:LAY,module_id:src.module_id,app_key:'crm',definition:{...src.definition,success_message:name+' thank you',allowed_origins:['http://127.0.0.1:5500'],fields,attachments:{...src.definition.attachments,...(att||{})}}});
const o={};
// negative saves: hidden Number default with decimals / above max




const A=await api('POST','/web-forms?app=crm',mk('QA RT24 2822 A',[F('first_name',1,{min_length:3,max_length:10}),F('number_2',0,{min:1,max:100}),F('decimal',0,{min:0.5,max:9.5},{hidden:true,default_value:'2.5'})],{enabled:true}));
o.A=E(A);if(A.j?.data){fs.writeFileSync(OUT+'wf24A.json',JSON.stringify(A.j.data,null,1));o.Aid=A.j.data.id;o.Aatt=A.j.data.definition?.attachments;}
o.prev=JSON.parse(fs.readFileSync(OUT+'2822-setup.json','utf8'));fs.writeFileSync(OUT+'2822-setup.json',JSON.stringify(o,null,1));log(o);
