eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const L=arr((await api('GET','/workflow/rules?take=500')).j?.data).filter(x=>/^QA RT19 WF/.test(x.name));
o.total=L.length;o.activeBefore=L.filter(x=>x.isActive).map(x=>x.name);for(const x of L.filter(x=>x.isActive))o['deact '+x.name]=await deact(x.id);
o.uiProbe=L.filter(x=>/ui probe/.test(x.name)).length;
const sa=await api('GET','/workflow/actions/58ac300c-0bfe-4c18-a7e1-ae4f981fab14');o.savedAction=sa.j?.data?.isActive;
for(const id of [CFG.D,CFG.DB]){const g=(await api('GET','/desk/departments/'+id)).j?.data;const p=await api('PUT','/desk/departments/'+id,{...g,agent_user_ids:[]});o['empty '+g.name]=p.s+' '+(p.s>=300?p.t.slice(0,200):JSON.stringify(p.j?.data?.agent_user_ids));if(p.s<300)led(`department "${g.name}" ${id}: agents removed (was ${JSON.stringify(g.agent_user_ids)})`);}
const hs=(await api('GET','/desk/happiness/settings')).j.data;o.happiness=hs.is_enabled;
o.zz=arr((await api('GET','/iam/users?take=200')).j?.data).find(x=>x.userId==='5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1')?.status;
return o;
