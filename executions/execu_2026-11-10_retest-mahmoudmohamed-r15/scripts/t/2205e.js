const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const out={};
for (const id of ['97ca88d4-0817-4c4f-9742-eba78e12b6a0','7207ea60-b0ae-4bbb-9cf6-ecc0fe37819f','4f0b41ee-f29d-43e7-9907-497808b2f341']) {
  const d = await api('POST','/workflow/rules/'+id+'/deactivate'); const x = await api('DELETE','/workflow/rules/'+id); out[id]={deact:d.s, del:x.s, t:x.t.slice(0,150)}; LED('workflow rule '+id+' (bad tag ids) deactivate '+d.s+' delete '+x.s);
}
return out;
