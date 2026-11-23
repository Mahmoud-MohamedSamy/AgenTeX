const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const s=(await api('GET',`/modules/${TK}/records/5c68004d-860c-4bcd-b6b8-77e0bce5c044/blueprint-state`)).j?.data;const x=(s?.states||[])[0]||{};
return {cur:x.currentState||x.activeStates,tr:(x.allTransitions||[]).map(t=>JSON.stringify(t).replace(/"[a-z_]*[Ee]mail":"[^"]*"/g,'"email":"<x>"').slice(0,500))};
