const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const S=v=>({kind:'string',value:v}); const LED=s=>fs.appendFileSync('ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+s+'\n');
const N = +process.env.N, P = process.env.PFX; const ids=[]; let err;
for (let i=1;i<=N;i++){ const nm=P+' '+String(i).padStart(2,'0'); const r=await api('POST','/modules/'+CT+'/records',{data:[{field:'last_name',value:S(nm)},{field:'email',value:S('qa.rt16.'+P.split(' ').pop().toLowerCase()+i+'@example.com')}]}); const id=r.j&&r.j.data&&r.j.data.id; if(id) ids.push(id); else err=r.t.slice(0,300); }
LED('contacts "'+P+' 01..'+N+'" ('+ids.length+'): '+ids.join(','));
fs.writeFileSync('out/'+P.replace(/ /g,'_')+'.json', JSON.stringify(ids)); return {n:ids.length, err};
