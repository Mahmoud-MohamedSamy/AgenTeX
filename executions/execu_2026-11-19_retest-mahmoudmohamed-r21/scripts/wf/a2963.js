eval(fs.readFileSync('wf/lib.js','utf8'));
const X='<img src=x onerror="window.__xss=1">';const o={};
const r=await mkRule('2963',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'QA RT19 2963 comment '+X+' <b>bold</b> <a href="javascript:window.__xss=2">lnk</a>',commentPublic:false}],{isActive:true,description:'QA RT19 2963 desc '+X});
o.rule=r.res+' '+r.id;if(!r.id)return o;
const g=(await api('GET','/workflow/rules/'+r.id)).j?.data;o.stored=g?.actions?.[0]?.commentBody;o.storedDesc=g?.description;
const t=await mkTicket('2963',{},'ticket');o.t=t;await sleep(20000);
o.ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id).map(e=>({out:e.outcome,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError,d.target])}));
for(const p of [`/desk/tickets/${t.id}/comments`,`/desk/tickets/${t.id}/threads`,`/desk/tickets/${t.id}/conversations`]){const c=await api('GET',p);o[p.split('/').pop()]=c.s+' '+c.t.slice(0,900);}
o.deact=await deact(r.id);
fs.writeFileSync('wf/out/2963-ids.json',JSON.stringify({rule:r.id,t:t.id}));
save('2963',o);return o;
