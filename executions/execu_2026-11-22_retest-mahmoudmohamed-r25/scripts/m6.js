const ids=JSON.parse(fs.readFileSync('w2/out/seq2997.json','utf8')).tickets;const o=[];for(const id of ids){const g=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id);o.push([id.slice(0,8),g.s]);}
const a=arr((await api('GET','/audit/logs?limit=50&entity_id=a5208ac8-16fb-4b8c-8d8a-bce2ec5dbd41')).j?.data).map(x=>[x.occurred_at||x.created_at,x.action,x.actor_name||x.actor_id]);
return {seq:o,audit:a};
