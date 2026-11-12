// SL-40 (12 Nov): Test User 1's bell — contract-expiry notice for QA AO Contract SL40d01ql (ends 13 Nov, notify 1 day before).
const n=arr((await api('GET','/notifications?limit=100')).j?.data);
const hit=n.filter(x=>/SL40d01ql|contract/i.test(JSON.stringify(x)));
return {total:n.length,newest:n[0]&&String(n[0].created_at||n[0].createdAt).slice(0,19),hits:hit.map(x=>[String(x.created_at||x.createdAt).slice(0,19),x.title||x.subject,String(x.body||x.message||'').slice(0,140)])};
