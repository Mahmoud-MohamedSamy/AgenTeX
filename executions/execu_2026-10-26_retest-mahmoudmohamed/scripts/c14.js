page.on('dialog', d => d.accept().catch(() => {}));
const rp = (await api('GET', `/desk/tickets/6b1158b3-36f1-40dd-a5ba-688ef8f4df88/replies`)).j?.data; const r0 = arr(rp?.replies || rp)[0];
const out = { from_address: r0?.from_address, status: r0?.status, sent_at: r0?.sent_at, trusted: r0?.trusted };
for (const p of ['/desk/mailboxes', '/desk/email-addresses', '/desk/settings/email', '/desk/channels/email', '/desk/email/addresses']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.s === 200 ? r.t.slice(0, 400) : ''); }
return fin(out);
