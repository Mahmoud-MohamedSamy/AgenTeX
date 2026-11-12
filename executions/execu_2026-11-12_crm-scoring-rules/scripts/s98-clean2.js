// Cleanup for the second run (12 Nov). Run when staging answers again: bash -c 'cat common.js s98-clean2.js > .cur.js; LANE=crmscore node api.js ndc-staging-owner .cur.js'
const out={rules:await delAllQA()}; const L=await modId('leads');
let w=0; for(const x of arr((await api('GET','/workflow/rules?module_id='+L)).j.data)) if(String(x.name).startsWith('QA SR1112')){if((await api('DELETE','/workflow/rules/'+x.id)).s<300)w++;} out.workflows=w;
// undo imports (removes imported leads)
const u={}; for(const k of Object.keys(I).filter(k=>k.startsWith('imp_'))){const r=await api('POST','/modules/'+L+'/import/'+I[k]+'/undo'); u[k]=r.s;} out.importUndo=u;
// delete remaining QA records (L3 500, K7, K9, K3 ...)
let rd=0, rf=0; const seen=new Set(); for(const [mid,id] of (I.recs||[])){if(seen.has(id))continue; seen.add(id); const d=await api('DELETE','/modules/'+mid+'/records/'+id); if(d.s<300)rd++; else if(d.s!==404)rf++;} out.records={deleted:rd,failed:rf};
// sweep by search for anything left named QA SR1112
let sw=0; for(let p=0;p<30;p++){const it=arr((await api('GET','/modules/'+L+'/records?q='+encodeURIComponent('QA SR1112')+'&per_page=100')).j.data).filter(x=>JSON.stringify(x).includes('QA SR1112')); if(!it.length)break; for(const x of it){if((await api('DELETE','/modules/'+L+'/records/'+x.id)).s<300)sw++;}} out.swept=sw;
// field permission + QA fields
if(I.k9fp) out.fp=(await api('DELETE','/modules/'+L+'/field-permissions/'+I.k9fp)).s;
let fd=0; for(const f of await fields(L)) if(/^qa_sr1112/.test(f.fieldName)){if((await api('DELETE','/modules/'+L+'/fields/'+f.id)).s<300)fd++;} out.fields=fd;
let n=0; for(const m of arr((await api('GET','/modules')).j.data)) n+=arr((await api('GET','/scoring-rules?module_id='+m.id)).j.data).length; out.totalRulesLeft=n;
return out;
