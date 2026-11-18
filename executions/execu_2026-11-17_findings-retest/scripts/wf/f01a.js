eval(fs.readFileSync('wf/lib.js','utf8'));const o={};
const dj=(await api('GET','/desk/departments?take=200')).j?.data;const deps=Array.isArray(dj)?dj:(dj?.departments||dj?.items||[]);const DN=id=>(deps.find(d=>d.id===id)||{}).name||id;
const rr=(await api('GET','/desk/assignment-rules?type=round_robin')).j?.data?.rules||[];
o.active=rr.filter(r=>r.is_active).map(r=>r.id.slice(0,8)+' | '+r.name+' | '+DN(r.department_id)+' | '+JSON.stringify(r.execute_on)+' | '+JSON.stringify(r.criteria||r.conditions||r.targets).slice(0,250));
o.keys=Object.keys(rr[0]||{}).join(',');
const q=await api('GET','/desk/tickets?channel=email&take=20');o.q=q.s+' '+JSON.stringify(q.j?.data).slice(0,300);
return o;
