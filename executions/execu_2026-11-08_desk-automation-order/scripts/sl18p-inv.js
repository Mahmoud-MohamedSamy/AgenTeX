const S=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/sl18p.json','utf8'));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-18 portal ('+S.u+'): contact '+S.contact+', policies '+S.t.on.policy+' / '+S.t.off.policy+', tickets #'+S.t.on.number+' / #'+S.t.off.number+' in QA AO Dept A — delete after.\n');
const r=await api('POST','/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/invitations/contacts',{contact_ids:[S.contact]});
return {invite:r.s,body:r.t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,300)};
