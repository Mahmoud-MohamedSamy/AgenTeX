const DD='ff2611f5-4c5b-4cd2-8853-dd8767f401b6';const o={};
const st=(await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[];fs.writeFileSync(RUN+'/out/statuses-before-3136b.json',JSON.stringify(st,null,1));o.distType=st.find(s=>s.value==='QA NDC Distributor')?.type;
const t={};t.A=await mkT('sla','A',{owner:OWNER},DD);t.B=await mkT('wl','B',{owner:OWNER},DD);t.C=await mkT('wl','C',{owner:OWNER},DD);
fs.writeFileSync(RUN+'/out/3136b.json',JSON.stringify({DD,t},null,1));
for(let i=0;i<6;i++){await sleep(10000);const d=(await api('GET','/desk/tickets/'+t.A+'/sla')).j?.data;o['A_'+i]=d?.state+' '+(d?.policy?.name||'-')+' '+JSON.stringify((d?.obligations||[]).map(x=>x.kind+':'+x.state+':'+x.remaining_seconds));if(d?.state&&d.state!=='none')break;}
for(const k of ['A','B','C'])o['n'+k]=(await api('GET','/desk/tickets/'+t[k])).j?.data?.ticket_number;return o;
