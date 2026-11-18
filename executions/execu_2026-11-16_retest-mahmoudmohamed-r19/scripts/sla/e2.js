eval(fs.readFileSync('sla/lib.js','utf8'));const E=CFG.e1;
const a=await tk('2853 A3 recheck owner Samy R19SLA2853'+E.u,[f('owner',SAMY)]);
const g=(await api('GET','/modules/'+T+'/records/'+a.id)).j?.data;a.num=(g?.data||[]).find(z=>z.field==='ticket_number')?.value?.value;a.created=g?.created_at;
setCfg({e3:a});return a;
