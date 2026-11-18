const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')); const o={}; const which=process.env.W||'VR12';
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
if(which.startsWith('VR')){ const id=I[which]; const g=(await api('GET','/modules/'+T+'/validation-rules/'+id)).j.data;
 for(const st of ['inactive','disabled']){ const b={name:g.name,description:g.description,layoutId:g.layoutId,departmentIds:g.departmentIds,primaryField:g.primaryField,kind:g.kind,mode:g.mode,errorPlacement:g.errorPlacement,fieldVerification:g.fieldVerification,applyToHelpCenter:g.applyToHelpCenter,status:st,branches:g.branches.map(x=>({when:x.when,check:x.check,message:x.message,triggerOn:x.triggerOn})),rowVersion:g.rowVersion};
  let r=await api('PUT','/modules/'+T+'/validation-rules/'+id,b); if(r.s>=300) r=await api('PATCH','/modules/'+T+'/validation-rules/'+id,{status:st,rowVersion:g.rowVersion}); o[st]=r.s+' '+(r.s>=300?r.t.slice(0,200):''); if(r.s<300) break; }
 const a=(await api('GET','/modules/'+T+'/validation-rules/'+id)).j.data; o.now=a.status; LED('validation rule '+id+' set '+a.status); }
else { const id=I[which]; for(const p of ['/modules/'+T+'/blueprints/'+id+'/deactivate','/desk/blueprints/'+id+'/deactivate','/modules/'+T+'/blueprints/'+id+'/archive']){ const r=await api('POST',p,{}); o[p]=r.s; if(r.s<300) break; }
 const a=(await api('GET','/modules/'+T+'/blueprints/'+id)).j.data; o.active=a.isActive; LED('blueprint '+id+' isActive='+a.isActive); }
return o;
