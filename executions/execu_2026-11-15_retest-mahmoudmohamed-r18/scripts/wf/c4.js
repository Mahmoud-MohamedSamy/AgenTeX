const all=arr((await api('GET','/workflow/rules?take=200')).j?.data);const R={total:all.length};
const m=all.filter(r=>/QA RT18 WF 29(64|48)/.test(r.name));R.rules=m.map(r=>[r.id,r.name,r.isActive,r.createdAt]);
for(const r of m){led('workflow-rule',`"${r.name}" (UI, created ${r.isActive?'active':'inactive'})`,r.id);if(r.isActive)R['deact '+r.id.slice(0,8)]=await deact(r.id);}
R.activeNow=arr((await api('GET','/workflow/rules?take=200')).j?.data).filter(r=>r.isActive).map(r=>r.name);
return R;
