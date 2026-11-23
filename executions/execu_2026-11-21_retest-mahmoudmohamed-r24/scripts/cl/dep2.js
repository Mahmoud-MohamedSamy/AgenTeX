const inv=JSON.parse(fs.readFileSync('../out/inv-desk.json','utf8'));const o={};const all=arr((await api('GET','/desk/departments?limit=500')).j?.data);
for(const [id,n] of inv.cfg.departments){const d=all.find(x=>x.id===id);if(!d){o[n]='gone';continue;}const g=(await api('GET','/desk/departments/'+id)).j?.data;const dd=g?.department||g;
o[n]='agents='+JSON.stringify((dd.agent_ids||dd.agents||dd.members||[]).map(a=>String(a.id||a.user_id||a).slice(0,8)))+' keys='+Object.keys(dd).filter(k=>/agent|member|channel|email/i.test(k)).join(',');}
return o;
