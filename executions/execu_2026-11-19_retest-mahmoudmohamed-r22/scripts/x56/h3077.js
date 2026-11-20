const T=JSON.parse(fs.readFileSync(RUN+'/out/3077.json','utf8'));const o={};
for(const [k,id] of [['single',T.sid],['burst1',T.ids[0]],['burst10',T.ids[9]]]){const h=await histRaw(id);o[k]=h.map(x=>x.action.replace('ticket.','')+(x.field_key?':'+x.field_key:'')+' '+(x.occurred_at||'').slice(11,19)).join(' | ');}
o.activity=(await feed(T.sid)).length;return o;
