const id = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7';
const p = await api('PATCH', `/modules/${TK}/records/${id}`, { data: fields({ priority: 'medium' }) }); await sleep(2000);
return { patch: E(p), tr: await trans(id), st: (await bstate(id))?.activeStates };
