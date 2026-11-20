const T=JSON.parse(fs.readFileSync(RUN+'/out/3059.json','utf8'));let r=await api('PATCH','/desk/tickets/'+T.id,{status:'On Hold'});const a=(await api('GET','/desk/tickets/'+T.id)).j?.data?.status;
await api('PATCH','/desk/tickets/'+T.id,{status:'Open'});const b=(await api('GET','/desk/tickets/'+T.id)).j?.data?.status;return {ownerPatch:r.s,statusAfter:a,restored:b};
