// Deactivate every QA AO round robin rule in QA AS6 Dept A (and QA AO direct rules), using the version from the list.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};
const rr=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];
const dr=(await api('GET','/desk/assignment-rules?type=direct')).j?.data?.rules||[];
for(const r of [...rr,...dr].filter(x=>/^QA AO /.test(x.name)&&x.is_active)){
 let p=await api('PUT','/desk/assignment-rules/'+r.id+'/active',{is_active:false,version:r.version});
 if(p.s>=300)p=await api('PUT','/desk/assignment-rules/'+r.id+'/active',{is_active:false});
 R[r.name]=E(p);}
R.stillActive=((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[]).filter(x=>/^QA AO /.test(x.name)&&x.is_active).map(x=>x.name);
R.singleGet=(await api('GET','/desk/assignment-rules/'+rr[0]?.id)).s;
return R;
