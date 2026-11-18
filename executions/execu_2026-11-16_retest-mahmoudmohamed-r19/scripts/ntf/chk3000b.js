eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const x=await api('GET','/modules/'+TK+'/records?limit=5&q='+encodeURIComponent('3000 ack test'));const r=Ls(x.j?.data)[0];const id=r.id;
const o=await rec(id);const R={id:id.slice(0,8),num:o.ticket_number,status:o.status,channel:o.channel,dept:o.department===D,created:o.created_at||o.createdAt};
R.hist=(await histRaw(id)).map(h=>MASK(JSON.stringify(h)).slice(0,260));R.feed=(await feed(id)).map(h=>MASK(JSON.stringify(h)).slice(0,300));
fs.writeFileSync(OUT+'t4745.json',JSON.stringify({id},null,1));return R;
