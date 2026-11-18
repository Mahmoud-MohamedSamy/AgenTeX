eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const f=JSON.parse(fs.readFileSync(OUTD+'fin-ids.json','utf8'));
o.tickets=(await Promise.all(f.tks.map(id=>api('GET','/modules/'+T+'/records/'+id)))).map(r=>r.s).join(',');
o.rules=(await Promise.all(f.rules.map(id=>api('GET','/workflow/rules/'+id)))).map(r=>r.s+(r.j?.data?' active='+r.j.data.isActive:'')).join(',');
let n=0,cur=null;for(let i=0;i<20;i++){const r=(await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''))).j;const it=arr(r?.data);n+=it.filter(x=>/QA RT21 WF/.test(JSON.stringify(x))).length;cur=r?.meta?.next_cursor||r?.data?.next_cursor;if(!cur||!it.length)break;}o.rbLeft=n;
const all=arr((await api('GET','/workflow/rules?take=500')).j?.data);o.rulesNamedRT21WF=all.filter(r=>/QA RT21 WF/.test(r.name)).map(r=>r.name+' '+r.isActive);
o.as6=(await api('GET','/desk/departments/b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6/round-robin-preferences')).j?.data?.assign_to_offline_agents;
return o;
