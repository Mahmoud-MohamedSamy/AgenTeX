const mid = await modId(); const id = '39145329-a6e2-44c6-bd18-ded1ea892781'; const d = await api('DELETE', '/modules/' + mid + '/records/' + id); return SR(d).slice(0, 400);
