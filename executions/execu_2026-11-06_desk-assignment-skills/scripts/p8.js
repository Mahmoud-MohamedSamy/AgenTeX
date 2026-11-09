eval(require('fs').readFileSync('lib.js','utf8'));
const q=(await api('GET','/desk/queues/agents')).j.data.agents; return q.filter(a=>[IDS.A1,IDS.A2,IDS.A3,IDS.O].includes(a.user_id)).map(a=>{const x={...a};x.department_ids=(a.department_ids||[]).length;delete x.email;return x;});
