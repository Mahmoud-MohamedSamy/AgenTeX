const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const mk=async(subj,extra)=>{const c=await api('POST','/modules/'+T+'/records',rec({subject:subj,department:I.D74,email:'qa.rt17@example.com',...extra})); const id=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id)); if(id){(I.T74=I.T74||[]).push(id);SAVE();LED('desk ticket '+subj+' '+id);} let st=null; if(id){const d=(await api('GET','/modules/'+T+'/records/'+id)).j.data; st=(JSON.stringify(d).match(/"status","value":\{"kind":"[a-z]+","value":"([^"]*)"/)||[])[1];} return SR(c)+(c.s>=300?' '+c.t.slice(0,200):'')+' status='+st;};
o.noStatus=await mk('QA RT17 2174 no status',{});
o.withOpen=await mk('QA RT17 2174 Open',{status:'Open'});
o.onHold=await mk('QA RT17 2174 On Hold',{status:'On Hold'});
fs.writeFileSync(RUN+'/out/2174b.json',JSON.stringify(o,null,1)); return o;
