const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const enc=v=>({kind:'string',value:String(v)}); const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const N = parseInt(process.env.N||'450',10), START=parseInt(process.env.START||'1',10);
const ids=[]; let fail=0, lastErr='';
for (let i=START;i<START+N;i++){
  const r = await api('POST','/modules/'+L+'/records', body({first_name:'QA RT15', last_name:'2807 '+String(i).padStart(4,'0')}));
  const id = r.j&&r.j.data&&(r.j.data.id||(r.j.data.record&&r.j.data.record.id));
  if (id) ids.push(id); else { fail++; lastErr = r.s+' '+r.t.slice(0,200); if (r.s===429) break; }
}
fs.appendFileSync(RUN+'/ledger-crm.md', '- '+new Date().toISOString().slice(0,19)+' CRM Leads "QA RT15 2807 nnnn" created '+ids.length+' records (ids in out/2807-leads.json)\n');
const f = RUN+'/out/2807-leads.json'; const prev = fs.existsSync(f)? JSON.parse(fs.readFileSync(f,'utf8')) : [];
fs.writeFileSync(f, JSON.stringify(prev.concat(ids)));
return { created: ids.length, fail, lastErr };
