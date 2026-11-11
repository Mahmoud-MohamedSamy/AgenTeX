const SA='2fc71fc1-ca33-4069-80e3-c6496b149834';const r=await mkRule('P26',{kind:'RecordCreated'},[{type:'AddTicketComment',standaloneActionId:SA}]);
const t=await mkTicket('P26');await sleep(20000);
const ex=(await execs(t.id)).filter(e=>e.rule===r.id);const cm=arr2((await api('GET','/desk/tickets/'+t.id+'/comments')).j?.data).map(c=>String(c.body_html).slice(0,40));
const u=await api('GET',`/workflow/actions/${SA}/usage`);return {rule:r.s+(r.err||''),exec:ex.map(e=>e.outcome+' '+e.actions.join(',')),cm,usage:[u.s,JSON.stringify(u.j?.data).slice(0,200)]};
