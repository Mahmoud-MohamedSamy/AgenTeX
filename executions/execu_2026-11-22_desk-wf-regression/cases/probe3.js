const r = await api('GET','/workflow/executions?take=5');
const rr = await api('GET','/workflow/executions?ruleId=cb7e6344-f00a-40b2-a5be-56ff42cbf8ac&take=5');
return { s:r.s, top: arr(r.j && r.j.data).slice(0,3).map(x=>JSON.stringify(x).slice(0,700)), meta: JSON.stringify(r.j && r.j.meta), byRule: rr.t.slice(0,300) };
