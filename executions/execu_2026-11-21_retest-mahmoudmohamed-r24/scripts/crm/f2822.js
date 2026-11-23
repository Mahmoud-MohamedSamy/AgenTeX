const src=JSON.parse(fs.readFileSync('../out/wf-crm-def.json','utf8'));const F=(key,req,validation)=>({key,placeholder:null,label:null,required:!!req,hidden:false,default_value:null,help:null,validation:validation||null});
const forms=[['QA RT22 2822 A','6261fa51-b6e7-4c73-a83d-f6ecbd6260d1',[F('first_name',1,{min_length:3,max_length:10}),F('number_2',0,{min:1,max:100}),F('decimal',0,{min:0.5,max:9.5}),F('date',0,{min_date:'2026-11-01',max_date:'2026-12-31'}),F('date_time',0),F('pick_list_2',0),F('multi_select',0)]],
['QA RT22 2822 B','65062122-a015-4101-abed-c6b1f53913ea',[F('first_name',1),F('email',0,{max_length:30}),F('phone',0,{max_length:12}),F('qa_rt18_text',0,{min_length:2,max_length:8})]]];
const out={};const only=process.env.ONLY;
for(const [name,lay,fields] of forms){if(only&&!name.endsWith(only))continue;const def={...src.definition,success_message:name+' thank you',allowed_origins:['http://127.0.0.1:5500'],fields};
const r=await api('POST','/web-forms?app=crm',{kind:'advanced_form',name,department_id:null,layout_id:lay,module_id:src.module_id,app_key:'crm',definition:def});
if(r.s<300){fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: created web form '+name+' '+r.j.data.id+' (delete)\n');fs.writeFileSync('../out/wf'+name.slice(-1)+'.json',JSON.stringify(r.j.data,null,1));}
out[name]=r.s+' '+String(r.t).replace(/fw1\.[\w.-]+/g,'<key>').slice(0,900);}
return out;
