const S=v=>({kind:'string',stringValue:v});
const r=await mkRule('N2',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('QA WF N2 set')}},{type:'Task',taskTitle:'QA AO WF N3 task',taskDueOffsetDays:1,taskStatus:null,taskPriority:null,taskNotifyAssignee:false}]);
const t=await mkTicket('N2');await waitExec(t.id,1,45);await sleep(5000);
fs.writeFileSync('../a4/n2.json',JSON.stringify({rule:r.id,ticket:t.id}));return {rule:r.s+(r.err||''),ticket:t.id};
