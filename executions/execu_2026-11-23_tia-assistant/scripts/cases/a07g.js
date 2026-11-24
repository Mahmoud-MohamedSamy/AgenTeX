const id = '44444444-4444-4444-4444-444444444402';
const p = await api('POST', `/iam/profiles/${id}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' });
return { grant: p.s };
