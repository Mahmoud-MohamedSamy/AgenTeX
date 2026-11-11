const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const mark=t=>[{type:'AddTicketComment',commentBody:'QA AO WF '+t+' fired',commentPublic:false}];
const b=await mkRule('U1 P5',{kind:'TicketEvent',ticketEvents:{events:['rating'],ratings:['bad']}},mark('P5 bad rating'),{name:'QA AO WF U1 P5 bad'});
const a=await mkRule('U1 P5',{kind:'TicketEvent',ticketEvents:{events:['rating']}},mark('P5 any rating'),{name:'QA AO WF U1 P5 any'});
U.p5b=b.id;U.p5a=a.id;fs.writeFileSync('../a4/u1.json',JSON.stringify(U,null,1));
const g=(await api('GET','/workflow/rules/'+a.id)).j?.data?.trigger?.ticketEvents;return {bad:b.s+(b.err||''),any:a.s+(a.err||''),anyStored:g};
