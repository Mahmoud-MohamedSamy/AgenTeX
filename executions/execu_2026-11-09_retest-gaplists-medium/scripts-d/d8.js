const out={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';
for(const p of ['/automation/approval-processes','/approval-processes','/approvals/processes','/modules/'+T+'/approvals','/automation/approvals','/desk/approval-rules','/automation/approval-rules?module_id='+T,'/approval-processes?module_id='+T,'/automation/approval-processes?module_id='+T,'/desk/automation/approval-processes']){const r=await api('GET',p);out[p]=r.s+' '+(r.s<300?JSON.stringify(r.j.data).slice(0,200):'');}
return out;
