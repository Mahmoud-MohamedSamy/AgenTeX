const T='88e8ea44-1658-4df3-9930-d0902b91073d', TK='d120a6c2-2596-4254-968b-a1bcd3a000bf', CL='f7e488b5-0232-42fd-811c-1f24356af653', DB='ce1d8a43-07df-4b37-891c-cc8b2eceec6f';
const S=v=>({kind:'string',value:v}); const LED=s=>fs.appendFileSync('ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+s+'\n');
const B=o=>({data:Object.entries(o).map(([field,v])=>({field,value:S(v)}))}); const out={};
let r = await api('POST','/modules/'+T+'/records',B({subject:'QA RT16 2635 ticket',department:DB,status:'Open'})); const tid=r.j&&r.j.data&&r.j.data.id; out.ticket=[r.s,tid]; if(tid) LED('ticket "QA RT16 2635 ticket" '+tid);
out.tasks=[];
for (const n of ['A','B','C']) { r = await api('POST','/modules/'+TK+'/records',B({subject:'QA RT16 2635 task '+n,department:DB,status:'Not Started',ticket_id:tid,related_to:T+':'+tid})); const id=r.j&&r.j.data&&r.j.data.id; out.tasks.push([r.s,id,id?'':r.t.slice(0,300)]); if(id) LED('task "QA RT16 2635 task '+n+'" '+id); }
r = await api('POST','/modules/'+CL+'/records',B({subject:'QA RT16 2635 call',department:DB,ticket_id:tid,related_to:T+':'+tid})); const cid=r.j&&r.j.data&&r.j.data.id; out.call=[r.s,cid,cid?'':r.t.slice(0,300)]; if(cid) LED('call "QA RT16 2635 call" '+cid);
const m = await api('GET','/modules?app_key=desk'); out.mods=arr(m.j&&m.j.data||m.j).map(x=>[x.id,x.api_name||x.name]).filter(x=>/event|activit/i.test(x[1]));
const tk = await api('GET','/desk/tickets/'+tid); out.counts=tk.j&&tk.j.data&&tk.j.data.counts; out.tkeys=tk.j&&Object.keys(tk.j.data);
return out;
