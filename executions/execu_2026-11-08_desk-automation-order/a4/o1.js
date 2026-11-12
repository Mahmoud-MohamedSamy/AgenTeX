const X='<img src=x onerror="window.__xss=1">';const r=await mkRule('O1',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'QA AO WF O1 comment '+X,commentPublic:false}],{name:'QA AO WF O1 '+X,description:'QA AO WF O1 '+X});
const t=await mkTicket('O1');await sleep(15000);fs.writeFileSync('../a4/o1.json',JSON.stringify({rule:r.id,ticket:t.id}));
const g=(await api('GET','/workflow/rules/'+r.id)).j?.data;return {save:r.s+(r.err||''),storedName:g&&g.name,ticket:t.s};
