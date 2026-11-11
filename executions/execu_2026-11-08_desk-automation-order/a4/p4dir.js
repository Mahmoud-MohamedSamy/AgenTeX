const R={};const mark=t=>[{type:'AddTicketComment',commentBody:'QA AO WF '+t+' fired',commentPublic:false}];
for(const d of ['incoming','outgoing','any'])R[d]={rule:await mkRule('P4'+d,{kind:'TicketEvent',ticketEvents:{events:['private_thread'],privateThreads:d}},mark('P4'+d))};
for(const d of Object.keys(R)){R[d].ticket=await mkTicket('P4'+d);}
await sleep(6000);
for(const d of Object.keys(R))R[d].fwd=(await api('POST',`/desk/tickets/${R[d].ticket.id}/replies`,{mode:'forward',to:[QA_EMAIL],subject:'Fwd: QA AO WF P4'+d,body_html:'<p>QA AO WF P4 '+d+' forward</p>'})).s;
await sleep(25000);for(const d of Object.keys(R))R[d].runs=(await execs(R[d].ticket.id)).filter(e=>e.rule===R[d].rule.id).length;
const S={};for(const d of Object.keys(R))S[d]={rule:R[d].rule.s,fwd:R[d].fwd,runs:R[d].runs};return S;
