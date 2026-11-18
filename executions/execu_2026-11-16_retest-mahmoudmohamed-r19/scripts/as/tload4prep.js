var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const o={closed:0,a3open:[]};
for(const id of made.tickets){if(typeof id!=='string')continue;const r=await rec(id);if(r.department!==AOB||r.status!=='Open')continue;if(r.owner===A1){await patch(id,{status:'Closed'});o.closed++;}else if(r.owner===A3)o.a3open.push(r.subject);}
o.at=new Date().toISOString();await sleep(3000);o.A1=(await wl(A1,AOB)).dept;o.A3=(await wl(A3,AOB)).dept;save('tload4prep.json',o);return o;
