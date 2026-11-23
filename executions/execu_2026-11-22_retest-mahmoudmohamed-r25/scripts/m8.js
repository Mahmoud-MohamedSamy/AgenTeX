const id='8bef574a-1faa-4a30-99e0-55dd53e4738c';const g=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id);
const rs=arr((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).map(x=>[x.created_at,x.direction,x.status,x.from_address]);
const a=arr((await api('GET','/desk/tickets/'+id+'/activity')).j?.data).filter(x=>/message/.test(x.action)).map(x=>[x.occurred_at,x.action,JSON.stringify(x.summary)]);
return {exists:g.s,rs,a,health:(await api('GET','/desk/channels/inbound-health')).s};
