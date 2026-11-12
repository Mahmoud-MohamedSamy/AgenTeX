const mid = await modId(); const g = (await getRule(mid, I.x6)).j.data;
const u = await putRule(mid, I.x6, { ...g, status: 'active', branches: [B(C('contains', 'qa_vr_ml', 'zzz'), 'QA X6 ml cannot contain zzz')] });
const a = await mkRec(mid, { ...I.base, last_name: P + ' X6 after fix' }, I.layout); const b = await mkRec(mid, { ...I.base, last_name: P + ' X6 bad', qa_vr_ml: 'zzz' }, I.layout);
await delRule(mid, I.x6); return `fix+on ${u.s}; empty ml -> ${a.s}; 'zzz' -> ${b.s}`;
