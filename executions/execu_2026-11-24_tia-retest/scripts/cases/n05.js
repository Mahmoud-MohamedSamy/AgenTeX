let conv = null; const t0 = Date.now(); const errs = []; let n = 0;
for (let i = 1; i <= 21; i++) { const r = await ask(`QA TIA N05 message ${i}: reply with just the number ${i}.`, conv ? { conversation_id: conv } : {}); if (r.final?.conversation_id) conv = r.final.conversation_id; else errs.push(i + ':' + (r.error || r.status)); n++; }
const m = await api('GET', `/agents/tia/conversations/${conv}/messages`); const msgs = arr(m.j?.data);
fs.writeFileSync(RUN + '/out/n05-conv.txt', conv);
return { conv: conv && conv.slice(0, 8), sent: n, errs, messagesReturned: msgs.length, meta: m.j?.meta, ms: Date.now() - t0 };
