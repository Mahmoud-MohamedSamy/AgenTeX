const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const o={};
const rule=JSON.parse(fs.readFileSync('../out/3137-base.json','utf8')).rule;
const d=await api('DELETE','/desk/assignment-rules/'+rule);o.ruleDel=d.s+' '+String(d.t).slice(0,120);
const ids=['a20f7e78-cf70-4d36-a9ae-ff57c8dc3dea','c18b1e05-138d-4bb8-9f04-0c670c2c4e60','c657c9b4-f21d-4bde-901a-044e5597d8c6','968030c2-afbd-486a-9054-713c7a79284f'];
for(let k=0;k<16&&ids.length;k++){for(const id of [...ids]){const r=await api('DELETE','/modules/'+TK+'/blueprints/'+id);o[id.slice(0,8)]=r.s+' '+(r.s>=300?String(r.t).slice(60,200):'');if(r.s<300||r.s===404)ids.splice(ids.indexOf(id),1);}if(ids.length)await sleep(15000);}
o.left=ids.length;return o;
