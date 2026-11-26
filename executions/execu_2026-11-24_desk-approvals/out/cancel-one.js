const id = process.env.CID, t = process.env.CT; const r = await api.A('POST', `/desk/tickets/${t}/approvals/${id}/cancel`, {}); return E(r);
