const ids=['2a7c1bc4-f6d4-4bd3-805e-0496ece13987','876ce871-2b02-4854-89a7-68050391c62b','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4','9d182dfa-05f3-4af7-9685-8615a2fbe537','e82f62cb-9904-42c7-a13c-77a7449820b9'];
const o={};for(const b of [{user_ids:ids},{userIds:ids}]){const x=await api('POST','/desk/agents/presence/query',b);o[Object.keys(b)[0]]=x.s+' '+x.t.slice(0,900);}
o.settings=(await api('GET','/desk/agent-presence/settings')).t.slice(0,500);
return o;
