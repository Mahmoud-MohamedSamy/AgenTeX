eval(fs.readFileSync('lib-as.js','utf8'));const R={};R.switches=await notif();R.prefs=await prefs();
const rr=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];R.aoRules=rr.filter(x=>/^QA AO /.test(x.name)).map(x=>x.name+' '+x.is_active);
return R;
