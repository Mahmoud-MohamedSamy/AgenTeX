// Delete leftover "QA AS6 cap" skills (6-7 Nov limit test) from QA AS6 Dept A (user OK 15 Nov).
eval(fs.readFileSync('lib-as.js','utf8'));const get=async()=>{const s=(await api('GET','/desk/skills?department_id='+DA)).j?.data;return Array.isArray(s)?s:(s?.skills||[]);};
const L=await get();const cap=L.filter(x=>/^QA AS6 cap/.test(x.name));const R={before:L.length,activeBefore:L.filter(x=>x.is_active).length,cap:cap.length,others:L.filter(x=>!/^QA AS6 cap/.test(x.name)).map(x=>x.name),del:{}};
for(const x of cap){const d=await api('DELETE','/desk/skills/'+x.id+'?department_id='+DA);R.del[d.s]=(R.del[d.s]||0)+1;if(d.s>=300)R.err=E(d).slice(0,200);}
const A=await get();R.after=A.length;R.activeAfter=A.filter(x=>x.is_active).length;R.capLeft=A.filter(x=>/^QA AS6 cap/.test(x.name)).length;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' Deleted '+cap.length+' "QA AS6 cap" skills from QA AS6 Dept A (user OK). Left: '+R.capLeft+'.\n');return R;
