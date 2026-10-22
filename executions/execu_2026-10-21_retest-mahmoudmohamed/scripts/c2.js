const id = '6efdaee1-c891-4b6e-bc97-8db54f607138';
const d = await api('DELETE', `/teamspaces/${id}`);
return { del: d.s + ' ' + (d.s >= 300 ? d.t.slice(0, 200) : ''), after: (await api('GET', `/teamspaces/${id}`)).s };
