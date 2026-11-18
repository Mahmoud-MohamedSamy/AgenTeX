var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const o={};
for(const q of ['b1thr','m start +2','4546']){const r=await api('GET','/modules/'+T+'/records?q='+encodeURIComponent(q)+'&per_page=20');o[q]=r.s+' '+JSON.stringify((r.j?.data?.items||r.j?.data||[]).map(x=>{const d={};for(const y of x.data||[])d[y.field]=y.value?.value;return [d.ticket_number,d.subject,d.status,nm(d.owner),x.is_deleted];}));}
const a=await api('GET','/audit/logs?limit=30&q=4546');o.audit=a.s+' '+a.t.slice(0,300);
return o;
