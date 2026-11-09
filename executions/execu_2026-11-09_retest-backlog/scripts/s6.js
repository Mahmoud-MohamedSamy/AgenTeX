eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};
if(!IDS.fDec){const r=await api('POST','/modules/'+T+'/fields',{fields:[
 {fieldName:'qa_rt9_round',apiName:'qa_rt9_round',labels:{en:'QA RT9 Round'},datatypeKey:'decimal',datatypeOptions:{}},
 {fieldName:'qa_rt9_default',apiName:'qa_rt9_default',labels:{en:'QA RT9 Default'},datatypeKey:'single_line',datatypeOptions:{}}]});
 o.create=sh(r);}
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);
for(const f of F){if(f.fieldName==='qa_rt9_round'&&!IDS.fDec){IDS.fDec=f.id;LED('field qa_rt9_round '+f.id);}if(f.fieldName==='qa_rt9_default'&&!IDS.fDef){IDS.fDef=f.id;LED('field qa_rt9_default '+f.id);}}
saveIds();o.IDS=IDS;return o;
