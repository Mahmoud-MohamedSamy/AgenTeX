const all = ids(); const r = await api('DELETE', `/modules/${M.leads}/records/${all.k03}`); ledger(`K-03: lead ${all.k03} deleted (${r.s})`); return { del: r.s };
