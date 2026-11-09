eval(require('fs').readFileSync('lib.js','utf8'));
const g=await getRule(IDS.RR_SEQ);const p=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
return {seq:{active:g.is_active,exec:g.execute_on,method:g.method,crit:JSON.stringify(g.targets||g.criteria).slice(0,500),pool:JSON.stringify(g.pool||g.agents||'').slice(0,200)},prefs:JSON.stringify(p).slice(0,600),mk:mkTicket.toString().slice(0,400),own:own.toString().slice(0,200)};
