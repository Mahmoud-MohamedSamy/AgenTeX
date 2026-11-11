const o=JSON.parse(fs.readFileSync('../d14w-orig.json','utf8'));const d=JSON.parse(fs.readFileSync('../d14w.json','utf8'));const R={};
R.restore=(await api('PUT','/desk/assignment/notification-settings',o)).s;R.after=(await api('GET','/desk/assignment/notification-settings')).j.data;
if(d.rule)R.delRule=(await api('DELETE','/desk/assignment-rules/'+d.rule)).s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' D-14 web: switches restored '+R.restore+', rule deleted '+R.delRule+'.\n');return R;
