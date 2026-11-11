const o={}; const d=async p=>(await api('DELETE',p)).s;
const led=fs.readFileSync(RUN+'/ledger.md','utf8'); const r3=led.slice(led.indexOf('ROUND 3'));
// reports
o.reports=[]; for(const id of [...new Set([...r3.matchAll(/report [^\n]*? ([0-9a-f-]{36})/g)].map(m=>m[1]))]){ const g=await api('GET','/reporting/reports/'+id); const dd=g.j&&g.j.data&&(g.j.data.data||g.j.data); const rev=dd&&(dd.revision??dd.row_version??dd.version); const x=await api('DELETE','/reporting/reports/'+id+'?expected_revision='+rev); o.reports.push(id.slice(0,8)+':'+g.s+'/'+x.s+(x.s>=300?' '+E(x):'')); }
// blueprint
o.bp=I.BP?await d('/modules/'+L+'/blueprints/'+I.BP):'-';
// dependency maps
o.maps=[]; for(const m of [I.MAP1,I.MAP2]) if(m) o.maps.push(await d('/modules/'+L+'/dependency-maps/'+m));
// records
o.recs=[]; for(const m of r3.matchAll(/record ([^\n]*?) ([0-9a-f-]{36})\n/g)) o.recs.push(m[1]+':'+await d('/modules/'+L+'/records/'+m[2]));
// fields
o.fields=[]; for(const m of r3.matchAll(/field (qa_gs1111_\w+) ([0-9a-f-]{36})/g)) o.fields.push(m[1]+':'+await d('/modules/'+L+'/fields/'+m[2]));
// sets
o.sets=[]; for(const s of arr((await api('GET','/global-sets')).j.data).filter(s=>/^QA GS1111/.test(s.name))) o.sets.push(s.name+':'+await d('/global-sets/'+s.id));
LED('CLEANUP round 3 '+JSON.stringify(o)); return o;
