var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const hits=[];let scanned=0;
for(let p=1;p<=4&&hits.length<3;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc');const L=g.j?.data?.items||g.j?.data||[];
 for(const r of L){if(/QA RT20 TK 3055 bulk/.test(JSON.stringify(r.data||[])))continue;scanned++;const f=await feed(r.id);const a=f.find(e=>/auto_assign/.test(e.action));if(a){const o={};for(const x of r.data||[])o[x.field]=x.value?.value;hits.push([o.subject,a.action,a.occurred_at,a.summary?.rule_name]);if(hits.length>=3)break;}}}
return {scanned,hits};
