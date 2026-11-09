eval(require('fs').readFileSync('lib.js','utf8'));const fs2=require('fs');
fs2.writeFileSync('../out/presence-ctl.json',JSON.stringify({a1:'out',a2:'out',a3:'out'}));const o={};
for(const w of [8,16,30]){await W(w===8?8000:w===16?8000:14000);const r=await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]});o['t'+w]=(r.j.data.agents||[]).map(a=>JSON.stringify(a.presence.online)).join(',')+' stat='+fs2.readFileSync('../out/presence-stat.json','utf8');}
return o;
