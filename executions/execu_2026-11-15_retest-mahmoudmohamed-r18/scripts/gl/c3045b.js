const TM='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
for (const [k,id] of [['CS owned by C','13e3606a-89d9-40db-b64c-4c5bf4483e65'],['B1 #4067','ca675941-80ec-4595-a9f1-b095c31dbc3b']]) { const r=await api('GET','/modules/'+TM+'/records/'+id); o[k]=r.s+' '+(r.s>=400?(r.j&&r.j.error&&r.j.error.code):(((r.j.data.data||[]).find(f=>f.field==='ticket_number')||{}).value||{}).value); }
const s=await api('GET','/modules/'+TM+'/records?limit=20&q='+encodeURIComponent('QA RT18 3045')); o.search=s.s+' '+JSON.stringify(arr(s.j&&s.j.data).map(x=>(((x.data||[]).find(f=>f.field==='subject')||{}).value||{}).value));
return o;
