var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const rows=await allRows();const nn=rows.filter(r=>!r.ticket_number);const o={n:nn.length,total:rows.length};
o.list=[];for(const r of nn){const raw=await recRaw(r.id);o.list.push({id:r.id,ca:r.ca,lm:raw.last_modified_at,rv:raw.row_version,src:raw.source,subj:r.subject,status:r.status,owner:nm(r.owner),dept:nm(r.department),fields:(raw.data||[]).map(x=>x.field),activity:(await api('GET','/desk/tickets/'+r.id+'/activity')).j?.data?.length,history:(await api('GET','/desk/tickets/'+r.id+'/history')).j?.data?.length});}
const nums=rows.map(r=>+r.ticket_number).filter(Boolean).sort((a,b)=>a-b);o.max=nums[nums.length-1];
return o;
