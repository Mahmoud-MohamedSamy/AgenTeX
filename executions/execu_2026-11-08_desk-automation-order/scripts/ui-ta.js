const deps=(await api('GET','/desk/departments?is_active=true')).j?.data||[];const R=[];
for(const d of deps){const t=(await api('GET','/desk/departments/'+d.id+'/team-assignment')).j?.data;const teams=((await api('GET','/desk/teams')).j?.data?.teams||[]).filter(x=>x.department_id===d.id).length;R.push(d.name+' TA='+t?.enabled+' teams='+teams);}
return R.filter(x=>/TA=false|teams=[1-9]/.test(x));
