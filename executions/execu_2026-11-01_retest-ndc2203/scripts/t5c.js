const id = '429ccfc6-180f-4fb3-93d0-82cf8fce0683'; const t = await getTicket(id);
const hp = Object.fromEntries(Object.entries(t).filter(([k]) => /happiness|rating/i.test(k)));
const rp = arr((await api('GET', `/desk/tickets/${id}/replies`)).j?.data)[0];
const hdr = rp ? await api('GET', `/desk/tickets/${id}/replies/${rp.id}/headers`) : null;
return { ticketHappinessFields: hp, headers: hdr ? hdr.s + ' ' + hdr.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 500) : null, recipient: rp?.to?.[0]?.replace(/^[^@]+/, '<user>') };
