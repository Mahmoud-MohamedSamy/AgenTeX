const r = await api('DELETE', '/modules/6f553963-01d6-4b68-9fb3-143d23044c41/records/d9a7b0fa-2f75-449c-997c-c94f2cde243c'); return { del: r.s, at: new Date().toISOString() };
