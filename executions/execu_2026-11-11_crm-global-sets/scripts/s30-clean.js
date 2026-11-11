const out={}; const del=async(p)=>{const r=await api('DELETE',p); return r.s;};
out.rule=await del('/workflow/rules/'+I.W); out.view=await del('/modules/'+L+'/views/'+I.V);
// records: search QA GS1111 leads/contacts via ledger
const led=fs.readFileSync(RUN+'/ledger.md','utf8'); const recIds=[...led.matchAll(/record ([^\n]*?) ([0-9a-f-]{36})\n/g)].map(m=>[m[1],m[2]]);
out.recs=[]; for(const [n,id] of recIds){ const m=/contact/i.test(n)?I.C:L; out.recs.push(n+':'+await del('/modules/'+m+'/records/'+id)); }
const fields=[[L,I.fL],[I.C,I.fC],[L,I.fLocal],[L,I.fMulti],[L,I.fRadio],[L,I.fMap],[L,I.fMap2]]; out.fields=[];
for(const [m,f] of fields){ if(!f) continue; let s=await del('/modules/'+m+'/fields/'+f); if(s>=400){ const r=await api('DELETE','/modules/'+m+'/fields/'+f+'?force=true'); s=s+'/'+r.s+' '+E(r);} out.fields.push(s); }
const sets=arr((await api('GET','/global-sets')).j.data).filter(s=>/^QA GS1111|^qa gs1111/i.test(s.name)); out.sets=[];
for(const s of sets){ out.sets.push(s.name.slice(0,30)+':'+await del('/global-sets/'+s.id)); }
fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' CLEANUP '+JSON.stringify(out)+'\n');
return out;
