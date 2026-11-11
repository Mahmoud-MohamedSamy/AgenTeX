const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d', ACC='c0e05c3e-aa51-47ef-be50-53fd4c6edcb1'; const S=v=>({kind:'string',value:v});
const r = await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S('QA RT15 2796 accounting ticket')},{field:'department',value:S(ACC)},{field:'status',value:S('Open')}]});
const id = r.j&&r.j.data&&r.j.data.id; if(id) LED('ticket "QA RT15 2796 accounting ticket" '+id);
const g = (await api('GET','/modules/'+T+'/records/'+id)).j.data;
fs.writeFileSync(RUN+'/out/2796-ticket.json', JSON.stringify({id},null,1));
return {s:r.s, id, layout: g.layoutId||g.layout_id||g.layout, e: r.j&&r.j.error};
