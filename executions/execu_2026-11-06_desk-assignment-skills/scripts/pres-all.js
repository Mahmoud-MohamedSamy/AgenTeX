eval(require('fs').readFileSync('lib.js','utf8'));
const r=await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3,IDS.O]}); return r.t.slice(0,1500);
