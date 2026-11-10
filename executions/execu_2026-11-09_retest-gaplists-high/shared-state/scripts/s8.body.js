const out={};const S=v=>({kind:'string',value:v});
// restore Samy's manager first
if(ids.mgrSamy&&!ids.mgrSamyRestored){const r=await api('PATCH',`/iam/users/${SAMY}/reporting-manager`,{reporting_manager_id:null});out.restoreSamy=r.s+' '+r.t.slice(0,150);if(r.s<300){ids.mgrSamyRestored=true;save();log(`RESTORED reporting manager of Mahmoud Samy → none (${r.s})`);}}
const sm=arr((await api('GET','/iam/users?search=Mahmoud%20Samy')).j.data).find(u=>u.userId===SAMY);out.samyNow={mgr:sm.reportingManagerId,prof:sm.profileNames};
// fallback: owner (no manager) submits
const me=(await api('GET','/iam/me')).j.data;out.ownerMgr=me.reporting_manager_id||me.reportingManagerId||null;
if(!ids.AP2){const r=await api('POST',`/modules/${LEADS}/records`,{data:[{field:'first_name',value:S('QA SS 2417 AP2')},{field:'single_line_3_9',value:S('QA')}]});const id=r.j&&r.j.data&&r.j.data.id;out.AP2=r.s+' '+(id||r.t.slice(0,200));if(id){ids.AP2=id;save();log(`CREATED (as owner, no manager) lead "QA SS 2417 AP2" ${id} — approval fallback check`);}}
await sleep(4000);const a=await api('GET',`/workflow/approvals/records/${LEADS}/${ids.AP2}`);out.ap2=a.s+' '+(a.j&&a.j.data?JSON.stringify({state:a.j.data.state,cur:a.j.data.currentApprovers,levels:a.j.data.totalLevels,hist:(a.j.data.history||[]).map(h=>h.eventKind)}):a.t.slice(0,300));
const a1=await api('GET',`/workflow/approvals/records/${LEADS}/${ids.AP1}`);out.ap1Approver=a1.j&&a1.j.data&&a1.j.data.currentApprovers;
out.ids={A:ids.userA,B:ids.userB,C:ids.userC};
return out;
