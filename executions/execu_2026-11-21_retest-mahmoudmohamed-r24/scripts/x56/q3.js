const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const d=(await api('GET',`/modules/${TK}/blueprints/23339d62-fecf-4324-8950-5fa1bfdef0df`)).j?.data||{};
const T=(d.definition||d.graph||d).transitions||[];return {keys:Object.keys(d),tr:T.map(t=>JSON.stringify(t).replace(/"[a-zA-Z_]*[Ee]mail":"[^"]*"/g,'').slice(0,400))};
