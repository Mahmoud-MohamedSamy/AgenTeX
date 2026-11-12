const L=JSON.parse(fs.readFileSync(LEDGER,'utf8')).filter(x=>x.at>='2026-11-12');const out={};
for(const k of ['rule','action','ticket'])for(const x of L.filter(y=>y.k===k)){const p=k==='rule'?'/workflow/rules/':k==='action'?'/workflow/actions/':'/modules/'+T+'/records/';const r=await api('DELETE',p+x.id);out[k+' '+r.s]=(out[k+' '+r.s]||0)+1;}
const left=arr2((await api('GET','/workflow/rules?take=500')).j?.data).filter(r=>/^QA AO WF/.test(r.name)).map(r=>r.name);
return {out,leftQAAOWF:left};
