const T=JSON.parse(fs.readFileSync(RUN+'/out/3099.json','utf8'));const o={};
o.follow=E(await api('PUT','/desk/tickets/'+T.id+'/follow',{}));o.following=(await api('GET','/desk/tickets/'+T.id)).j?.data?.following;
const nb=await api('GET','/notifications?limit=5');o.notifEndpoint=nb.s;return o;
