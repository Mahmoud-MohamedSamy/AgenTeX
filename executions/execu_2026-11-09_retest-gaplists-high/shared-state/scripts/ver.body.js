const out={};const LK=['LA','LB','LC','LO','LD','LE','LF','AP1','AP2'];out.leads={};
for(const k of LK){out.leads[k]=(await api('GET',`/modules/${LEADS}/records/${ids[k]}`)).s;}
out.proc=(await api('GET',`/workflow/approval-processes/${ids.proc}`)).s;
const recIds=LK.map(k=>ids[k]).concat([ids.proc]);out.bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>recIds.includes(i.record_id)).length;
const all=arr((await api('GET','/iam/users')).j.data);out.total=all.length;out.qaLeft=all.filter(u=>/^QA SS/.test(u.displayName||'')).map(u=>u.displayName+'|'+u.status+'|'+(u.invitationStatus||''));
const sm=all.find(u=>u.userId===SAMY);out.samy={prof:sm.profileNames,mgr:sm.reportingManagerId,ou:sm.orgUnitId.slice(0,8)};
out.leadsVis=(await api('GET',`/modules/${LEADS}`)).j.data.recordVisibility;
log(`VERIFY: leads ${JSON.stringify(out.leads)}; process ${out.proc}; bin items left ${out.bin}; users total ${out.total}; QA SS left ${out.qaLeft.length}; Samy profiles "${out.samy.prof}" manager ${out.samy.mgr}; Leads visibility ${out.leadsVis}`);
return out;
