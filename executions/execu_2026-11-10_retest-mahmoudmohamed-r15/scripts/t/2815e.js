const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d', L='1b55c25d-eb27-4046-afd1-b292398b435b';
const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const bk = JSON.parse(fs.readFileSync(RUN+'/out/2815-standard-layout-backup.json','utf8')); const B = bk.data||bk;
const cur = (await api('GET','/modules/'+T+'/layouts/'+L)).j.data;
const body = JSON.parse(JSON.stringify(cur));
for (const k of Object.keys(body.views)) { if (B.views[k]) body.views[k].layout = B.views[k].layout; }
const r = await api('PUT','/modules/'+T+'/layouts/'+L, body);
const out = {put:r.s, e:E(r)};
if (r.s<300) LED('Standard layout restored from backup (views layouts) PUT '+r.s);
const del={s:0}; out.delField='skipped (already deleted)';
return out;
