const o = {};
for (const [m, id] of [['b2398920-2914-4836-be53-81bd960effea', 'cee8629a-2c72-4583-b962-fd10c6bccb80'], ['6d053261-6a93-4042-8496-19eeac878e32', '751d47ed-c184-46c3-af7e-64eb676f8561']]) {
  const g = await api('GET', '/modules/' + m + '/records/' + id); o[id.slice(0, 8)] = g.s + ' ' + JSON.stringify((g.j && g.j.data && g.j.data.data || []).filter(x => x.value && x.value.kind === 'string').slice(0, 5).map(x => x.field + '=' + x.value.value)) + ' created ' + (g.j && g.j.data && g.j.data.created_at);
  if (process.env.DEL === '1') { const d = await api('DELETE', '/modules/' + m + '/records/' + id); o[id.slice(0, 8)] += ' del ' + SR(d).slice(0, 120); if (d.s < 300) { I.purgeExtra.push(id); SAVE(); } }
}
return o;
