eval(fs.readFileSync('cr/lib.js','utf8'));const o={};const rid=JSON.parse(fs.readFileSync(OUTD+'t1-rules.json','utf8'));
for(const [k,id] of Object.entries(rid))o[k]=await deact(id);
const t4=JSON.parse(fs.readFileSync(OUTD+'t4.json','utf8'));for(const c of t4.recs.Calls)led(`Desk call record ${c.id} "${c.subject}" (created by QA RT20 CR 3052 rule)`);for(const c of t4.recs.Tickets)led(`Desk ticket ${c.id} "${c.subject}" (created by rule QA RT20 CR 3052 sysfill, default dept ${c.department})`);
const d=(await api('GET','/desk/departments/'+t4.recs.Tickets[0].department)).j?.data;o.childDept=d?.name;return o;
