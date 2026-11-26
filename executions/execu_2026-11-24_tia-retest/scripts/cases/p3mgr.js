const P = P3I.crmManagerProfile; const m = process.env.MODE; let s;
if (m === 'revoke') s = (await api('DELETE', `/iam/profiles/${P}/permissions/ai:tia:use`)).s; else s = (await api('POST', `/iam/profiles/${P}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' })).s;
ledger(`P3: CRM Manager ai:tia:use ${m} (${s})`); const r = await api('GET', `/iam/profiles/${P}/permissions`); const d = r.j?.data; return { s, count: (Array.isArray(d) ? d : d?.permissions || []).length };
