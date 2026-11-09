// 8 Nov D-14: create QA advanced web form in Dept A, owner mode unassigned
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const L=await api('GET','/web-forms/layouts?module_id='+T);o.layouts=JSON.stringify(L.j).slice(0,600);
const lim=await api('GET','/web-forms/limits?app=desk&module_id='+T);o.limits=JSON.stringify(lim.j).slice(0,300);
const ex=(await api('GET','/web-forms')).j.data.find(f=>f.name==='test');
const def={...ex.definition,success_message:'QA AS6 thanks',allowed_origins:['https://staging-crm.taviportal.com'],owner:{mode:'unassigned',user_id:null,assignment_rule_id:null,notify_owner:false,notify_email:false,notify_user_ids:null}};
const lay=arr(L.j.data&&(L.j.data.layouts||L.j.data));const layout_id=(lay[0]&&lay[0].id)||ex.layout_id;
const r=await api('POST','/web-forms',{kind:'advanced_form',name:'QA AS6 D14 form',department_id:IDS.DA,layout_id,module_id:T,app_key:'desk',definition:def});
o.create=r.s+' '+JSON.stringify(r.j).slice(0,500);
if(r.j&&r.j.data){IDS.WF_D14=r.j.data.id;saveIds();LED('D-14 8 Nov: web form "QA AS6 D14 form" '+r.j.data.id+' (Dept A, owner unassigned)');o.key=r.j.data.embed_key;o.enabled=r.j.data.is_enabled;}
return o;
