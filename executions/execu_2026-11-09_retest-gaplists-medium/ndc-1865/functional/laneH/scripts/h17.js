const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/ledger.md';const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';const out={};
const f=await api('POST','/desk/email-templates/folders',{name:'QA FT 1865 H folder',department_id:TECH,visibility:'all_agents'});out.folder=f.s+' '+f.t.slice(0,300);
const fid=f.j&&f.j.data&&(f.j.data.id||(f.j.data.folder&&f.j.data.folder.id));if(fid)log(`CREATED email template folder ${fid} (QA FT 1865 H folder, Tech) → ${f.s}`);
const t=await api('POST','/desk/email-templates',{name:'QA FT 1865 H template',module:'desk_tickets',notification_type:'contact',folder_id:fid,department_id:TECH,subject:'QA FT 1865 H template {{ticket.number}}',body_html:'<p>QA FT 1865 H template: ticket {{ticket.number}} "{{ticket.subject}}" status {{ticket.status}}. Please ignore.</p>',is_active:true});
out.template=t.s+' '+t.t.slice(0,400);const tid=t.j&&t.j.data&&(t.j.data.id||(t.j.data.email_template&&t.j.data.email_template.id));if(tid)log(`CREATED email template ${tid} (QA FT 1865 H template, folder ${fid}) → ${t.s}`);
out.fid=fid;out.tid=tid;return out;
