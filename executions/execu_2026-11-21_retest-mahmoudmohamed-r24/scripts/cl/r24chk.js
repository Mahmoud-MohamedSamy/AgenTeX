const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const o={};
const rule=JSON.parse(fs.readFileSync('../out/3137-base.json','utf8')).rule;o.ruleId=String(rule).slice(0,8);
o.ruleGet=(await api('GET','/desk/assignment-rules/'+rule)).s;
const rl=await api('GET','/desk/assignment-rules');o.list=rl.s;o.listShape=Object.keys(rl.j?.data||{}).slice(0,5);
for(const id of ['a20f7e78-cf70-4d36-a9ae-ff57c8dc3dea','c18b1e05-138d-4bb8-9f04-0c670c2c4e60','c657c9b4-f21d-4bde-901a-044e5597d8c6','968030c2-afbd-486a-9054-713c7a79284f']){const g=await api('GET','/modules/'+TK+'/blueprints/'+id);o['bp '+id.slice(0,8)]=g.s+' '+(g.j?.data?.isActive)+' '+(g.j?.data?.name||g.j?.data?.definition?.name||'');}
const bl=await api('GET','/modules/'+TK+'/blueprints');o.bpList=arr(bl.j?.data).map(b=>b.name||b.definition?.name).filter(n=>/QA/.test(n||''));
return o;
