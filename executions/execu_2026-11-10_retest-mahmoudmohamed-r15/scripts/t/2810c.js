const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const S=v=>({kind:'string',value:v}); const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message:'';
const out={};
for (const k of ['A','B']) {
  const r = await api('POST','/modules/'+CT+'/records',{data:[{field:'last_name',value:S('QA RT15 2810 '+k)},{field:'name',value:S('QA RT15 2810 '+k)},{field:'email',value:S('qa.rt15.2810'+k.toLowerCase()+'@example.com')}]});
  const id=r.j&&r.j.data&&r.j.data.id; out[k]={s:r.s,id,e:E(r)}; if(id) LED('Desk contact "QA RT15 2810 '+k+'" '+id);
}
await sleep(40000);
for (const k of ['A','B']) { const l = await api('GET','/desk/integrations/crm/links?record_id='+out[k].id); out[k].link = l.s+' '+JSON.stringify(l.j&&l.j.data).slice(0,400); }
fs.writeFileSync(RUN+'/out/2810-ids.json', JSON.stringify(out,null,1));
return out;
