const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2794-ids.json','utf8'));
const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', T='88e8ea44-1658-4df3-9930-d0902b91073d'; const S=v=>({kind:'string',value:v});
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const r = await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S('QA RT15 2794 team+agent ticket')},{field:'department',value:S(AO)},{field:'status',value:S('Open')}]});
const id=r.j&&r.j.data&&r.j.data.id; if(id) LED('ticket "QA RT15 2794 team+agent ticket" '+id);
const snaps=[]; for (const w of [5000, 15000, 30000]) { await sleep(w); const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data); snaps.push({after:w, owner:o.owner, team:o.team||o.team_id}); }
const act = await api('GET','/desk/tickets/'+id+'/activity'); const acts = arr(act.j&&act.j.data).map(a=>a.action+' '+JSON.stringify(a.summary||{}).slice(0,160));
fs.writeFileSync(RUN+'/out/2794-ticket.json', JSON.stringify({id},null,1));
return {id, num: fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).ticket_number, expectTeam:I.teamId, expectOwner:I.agentId, snaps, acts};
