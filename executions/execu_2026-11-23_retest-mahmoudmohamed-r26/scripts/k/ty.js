const before=JSON.parse(fs.readFileSync(RUN+'/out/statuses-before-3136.json','utf8'));const NEW=process.env.NEWTYPE;
const list=before.map(s=>s.value==='QA NDC Distributor'?{...s,type:NEW}:s);const r=await api('PUT','/desk/ticket-statuses',{statuses:list});
fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z r26: QA NDC Distributor type -> '+NEW+' ('+r.s+') — restore to open\n');
return {put:E(r),at:new Date().toISOString().slice(11,19)};
