const R={mailLen:MAIL.length,hasPlus:/\+r19ntf@/.test(MAIL)};
const ds=Ls((await api('GET','/desk/departments?limit=200')).j?.data);R.depts=ds.map(d=>d.name+' '+d.id.slice(0,8)).filter(x=>/QA RT19|QA AO Dept A|QA AS6/.test(x));
const ex=ds.find(d=>d.name==='QA RT19 NTF Dept');R.exists=ex?ex.id:null;R.sample=ex?MASK(JSON.stringify(ex)).slice(0,600):MASK(JSON.stringify(ds[0])).slice(0,600);
const h=await api('GET','/desk/happiness/settings');R.happ=MASK(JSON.stringify(h.j?.data)).slice(0,1500);
return R;
