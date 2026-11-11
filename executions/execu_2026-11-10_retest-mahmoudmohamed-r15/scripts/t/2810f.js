// Desk side: delete A in Desk
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2810-ids.json','utf8')); const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const d = await api('DELETE','/modules/'+CT+'/records/'+I.A.id); LED('deleted Desk contact "QA RT15 2810 A" '+I.A.id+' '+d.s);
I.deletedAt = new Date().toISOString(); fs.writeFileSync(RUN+'/out/2810-ids.json', JSON.stringify(I,null,1));
return {del:d.s, at:I.deletedAt};
