const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/';
const src=JSON.parse(fs.readFileSync(OUT+'wf-crm-def.json','utf8'));const F=(key,req)=>({key,placeholder:null,label:null,required:!!req,hidden:false,default_value:null,help:null,validation:null});
const E=r=>r.s+(r.s>=300?' '+String(r.t).replace(/fw1\.[\w.-]+/g,'<key>').slice(0,500):'');const LAY='6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const mk=(name,origins,share)=>({kind:'advanced_form',name,department_id:null,layout_id:LAY,module_id:src.module_id,app_key:'crm',definition:{...src.definition,success_message:name+' thank you',allowed_origins:origins,share_link_enabled:share,fields:[F('first_name',1),F('number_2',0)]}});
const o={};o.negNoSiteNoShare=E(await api('POST','/web-forms?app=crm',mk('QA RT24 3138 NEG',[],false)));
const c=await api('POST','/web-forms?app=crm',mk('QA RT24 3138 crm empty',[],true));o.crm=E(c);if(c.j?.data){fs.writeFileSync(OUT+'wf3138crm.json',JSON.stringify(c.j.data,null,1));o.crmId=c.j.data.id;}
fs.writeFileSync(OUT+'3138-setup.json',JSON.stringify(o,null,1));log(o);
