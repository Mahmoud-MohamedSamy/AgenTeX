const o = {};
for (const id of ['0b337d8e-0f37-4170-bfb9-1ea70281d6c7', '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5']) { const r = await api('DELETE', `/modules/${T}/records/${id}`); o[id] = r.s; const g = await api('GET', `/desk/tickets/${id}`); o[id + ' after'] = g.s; }
return done(o);
