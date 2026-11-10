const fs=require('fs');const C=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/ndc-creds.json','utf8'));
const out={};const mods=arr((await api('GET','/modules')).j);out.mods=mods.filter(m=>/contact|task|call|event|ticket/i.test(m.api_name||m.name||'')).map(m=>[m.id,m.api_name||m.name]);
const us=arr((await api('GET','/iam/users')).j);out.userKeys=Object.keys(us[0]||{}).join(',');
const deps=arr((await api('GET','/desk/departments')).j);
const depFull={};for(const d of deps){const g=await api('GET','/desk/departments/'+d.id);depFull[d.name]=(g.j&&(g.j.data||g.j)).agent_user_ids||[];}
out.creds=C.map((c,i)=>{const x=us.find(z=>String(z.email||'').toLowerCase()===String(c.user||'').toLowerCase());if(!x)return i+' '+c.name+' not found';
 const ids=[x.id,x.user_id,x.userId].filter(Boolean);
 const dn=Object.entries(depFull).filter(([n,a])=>a.some(y=>ids.includes(y))).map(([n])=>n);
 const r=Object.fromEntries(Object.entries(x).filter(([k])=>/role|admin|type|profile/i.test(k)));
 return i+' '+c.name+' | '+JSON.stringify(r).slice(0,200)+' | depts: '+dn.join(', ');});
out.depts=Object.entries(depFull).map(([n,a])=>n+': '+a.length);
return out;
