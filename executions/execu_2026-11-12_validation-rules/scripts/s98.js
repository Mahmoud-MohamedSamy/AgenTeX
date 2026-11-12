const mid = await modId(); const d = await api('DELETE', '/modules/' + mid + '/layouts/' + I.layout); return SR(d).slice(0, 500);
