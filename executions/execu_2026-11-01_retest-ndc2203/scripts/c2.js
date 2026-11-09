const ex = await api('GET', '/workflow/executions?recordId=284b780c-e8d4-466d-a93b-b9061889e16d');
const ex13 = await api('GET', '/workflow/executions?recordId=081b37e7-5a5c-4038-a32e-f8a3d4f23753');
const cm = await api('GET', '/desk/tickets/b4f32e33-93a0-4f81-893e-8f4571017ab1/comments');
const sk = await api('GET', '/desk/skills');
const agents = await api('GET', '/desk/agents?limit=100');
return fin({ ex14: ex.t.slice(0, 1500), ex13: ex13.t.slice(0, 900), cm: cm.t.slice(0, 600), skills: sk.t.slice(0, 900), agents: agents.s + ' ' + agents.t.slice(0, 300) });
