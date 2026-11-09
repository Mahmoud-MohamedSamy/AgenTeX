eval(require('fs').readFileSync('lib.js','utf8'));
const q=await api('GET','/desk/queues/agents'); const w=await api('GET','/desk/teams/'+IDS.TA+'/workload');
const ad=await api('GET','/desk/agents/'+IDS.A3+'/departments');
return {queues:q.s+' '+q.t.slice(0,1500), workload:w.s+' '+w.t.slice(0,800), agentDepts:ad.s+' '+ad.t.slice(0,300)};
