eval(fs.readFileSync('sla/lib.js','utf8'));const id=CFG.e3.id;
const g=(await api('GET','/modules/'+T+'/records/'+id)).j?.data;const num=(g?.data||[]).find(z=>z.field==='ticket_number')?.value?.value;
const items=arr((await feed(id))?.data);return {num,esc:items.filter(x=>x.action.startsWith('sla.esc')).map(x=>[x.occurred_at,x.summary.level,JSON.stringify(x.summary.actions),(x.summary.recipients||[]).map(r=>r.name).join(',')])};
