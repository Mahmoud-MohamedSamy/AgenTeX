// O1 isolate: payload in only one place per rule (name / description / comment body / webhook body / task title).
const X=n=>'<img src=x onerror="window.__xss=\''+n+'\'">';const plain=[{type:'AddTicketComment',commentBody:'plain',commentPublic:false}];const o={};
const defs={nm:[{name:'QA AO WF O1nm '+X('name')},plain],ds:[{description:'d '+X('description')},plain],cm:[{},[{type:'AddTicketComment',commentBody:'c '+X('comment'),commentPublic:false}]],tk:[{},[{type:'Task',taskTitle:'QA AO WF O1tk '+X('task'),taskStatus:'Not Started',taskPriority:'Normal'}]]};
for(const [k,[x,a]] of Object.entries(defs)){const r=await mkRule('O1'+k,{kind:'RecordCreated'},a,x);o[k]=r.id||r.s+' '+r.err;}
fs.writeFileSync('../a4/o1b.json',JSON.stringify(o));return o;
