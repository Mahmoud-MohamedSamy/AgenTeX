const mid = await modId(); const r = await mkRec(mid, { ...I.base, subject: P + ' H6 owner' }, I.layout); return r.s + ' ' + r.err.slice(0, 160);
