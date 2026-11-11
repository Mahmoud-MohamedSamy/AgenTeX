const o=JSON.parse(fs.readFileSync('../a4/b14.json','utf8'));const r={};
for(const m of o.made.filter(x=>x.id)){r[m.n]=(await api('DELETE','/workflow/rules/'+m.id)).s;}
const L=(await api('GET','/workflow/rules?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d&take=200')).j?.data;const a=Array.isArray(L)?L:(L?.items||[]);
r.after=a.length;r.leftB14=a.filter(x=>/B14/.test(x.name)).length;fs.appendFileSync('../ledger.md',`- ${new Date().toISOString()} A4 B14 rules deleted ${JSON.stringify(r)}\n`);return r;
