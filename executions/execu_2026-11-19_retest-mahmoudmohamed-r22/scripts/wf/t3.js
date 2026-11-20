eval(fs.readFileSync('wf/lib.js','utf8'));const id='f3ee35f3-ff2f-4cd2-a750-ce80e54825b7';const o={};
o.tags=((await api('GET',`/desk/tickets/${id}/tags`)).j?.data?.tags||[]).map(t=>t.name+'@'+t.department_id.slice(0,8));
o.ex=(await execsRaw(id)).map(e=>JSON.stringify({o:e.outcome,err:e.errorMessage,det:e.details,d:e.dispatches}).slice(0,700));return o;
