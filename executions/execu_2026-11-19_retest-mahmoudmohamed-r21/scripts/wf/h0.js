eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const L=x=>Array.isArray(x)?x:(x?.items||[]);
const t=await mkTicket('H0',{priority:'high'},'health probe');o.create=t.s+' '+t.num;o.t0=now();
for(let i=0;i<18;i++){await sleep(10000);const d=(await api('GET','/desk/tickets/'+t.id)).j?.data;const h=L((await api('GET',`/desk/tickets/${t.id}/history`)).j?.data);o['s'+(i+1)*10]=(d?.ticket_number||'-')+' hist='+h.map(x=>x.action).join(',');if(d?.ticket_number&&h.length){o.done=now();break;}}
save('h0',{...o,id:t.id});return o;
