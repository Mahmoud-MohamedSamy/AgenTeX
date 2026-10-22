const MID = 'c0394292-52a2-446d-a326-06733fe289ba', R = '0d879661-de11-44ec-93ec-56ab3420f39a';
const p1 = await api('PATCH', `/modules/${MID}/records/${R}`, { data: [{ field: 'qa_rx', value: enc('ab12') }] });
const p2 = await api('PATCH', `/modules/${MID}/records/${R}`, { data: [{ field: 'qa_rx', value: enc('ZZ9999') }] });
return done({ patchBad: p1.s + ' ' + (p1.j?.error?.details?.[0]?.message || p1.j?.error?.message || ''), patchGood: p2.s });
