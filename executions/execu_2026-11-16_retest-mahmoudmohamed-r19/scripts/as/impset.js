var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const PA=await prefs(DA);save('imp-prefs-orig.json',PA);
const p=await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false},DA);LED('QA AS6 Dept A prefs: offline allowed, thresholds off for 2275 import check -> '+p.s);
const r=await rule('round_robin','2275 import',[{criteria:{conditions:[{field_key:'subject',operator:'starts_with',value:PFX},{field_key:'subject',operator:'contains',value:'R19ASIMP'}],pattern:'1 and 2'},method:'sequential',pool:{kind:'agents',user_ids:[A1,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
await sleep(2000);
// control: API create with same subject key -> rule must assign
const c=await tk('R19ASIMP api control',{},DA);const w=await waitOwn(c,18);
save('imp-set.json',{rule:r.j?.data?.id,control:c,controlOwner:w});return {rule:E(r),id:r.j?.data?.id,control:w,num:(await rec(c)).ticket_number};
