const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};
const lvl={approver:{kind:'level',values:['2'],mode:null},waitingFieldAccess:{mode:'all',fields:[],resetFields:[]},afterStageUpdateFields:null,assignTask:null,assignToSubmitterManager:false,distribution:'broadcast',assigneeField:null,decisionFields:[]};
const fa={mode:'all',fields:[],resetFields:[]};
const body={moduleId:LEADS,name:'QA SS 2417 Levels',description:'QA test for NDC-2417 item 15; delete after',executeOnCreate:true,executeOnEdit:false,followsPreviousStage:false,isActive:true,
 admins:{adminUserIds:[ids.userA],adminRoleIds:[],allowEdit:false,editScope:'all_fields',notifyOriginalApproversEmail:false,notifyOriginalApproversInApp:false},
 rules:[{criteria:{kind:'StringMatch',field:'first_name',operator:'Contains',negate:null,caseInsensitive:false,stringValue:'QA SS 2417 AP',value:null,values:null,operands:null},levels:[lvl],finalActions:[],rejectionActions:[],rejectedFieldAccess:fa,approvedFieldAccess:fa}]};
if(!ids.proc){const r=await api('POST','/workflow/approval-processes',body);out.create=r.s+' '+r.t.slice(0,300);const id=r.j&&r.j.data&&r.j.data.id;if(id){ids.proc=id;save();log(`CREATED approval process "QA SS 2417 Levels" ${id} on Leads (active, criteria first_name contains "QA SS 2417 AP", level approver Levels depth 2, process admin QA SS A)`);}}
if(!ids.mgrC){const r=await api('PATCH',`/iam/users/${ids.userC}/reporting-manager`,{reporting_manager_id:ids.userB});out.mgrC=r.s+' '+r.t.slice(0,200);if(r.s<300){ids.mgrC=true;save();log(`SET reporting manager of QA SS C → QA SS B (throwaway users; original none)`);}}
return out;
