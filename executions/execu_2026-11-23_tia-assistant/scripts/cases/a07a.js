const id = '44444444-4444-4444-4444-444444444402';
const d = await api('DELETE', `/iam/profiles/${id}/permissions/${encodeURIComponent('ai:tia:use')}`);
return { del: d.s };
