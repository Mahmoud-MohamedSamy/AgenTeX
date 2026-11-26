const me = (await api('GET', '/iam/me')).j?.data; const myId = me?.id || me?.user_id || me?.userId;
const cnt = async f => { const r = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify(f))}`); const m = r.j?.meta || {}; return m.total_count ?? m.page?.total ?? m.total ?? m.total_in_scope ?? JSON.stringify(m).slice(0, 200); };
const base = [{ field: 'is_spam', operator: 'is_false', value: null }, { field: 'is_archived', operator: 'is_false', value: null }];
const truth = { open: await cnt([...base, { field: 'status', operator: 'equals', value: 'Open' }]), assignedToMe: await cnt([...base, { field: 'owner', operator: 'contains_any_of', value: [myId] }]), openAssignedToMe: await cnt([...base, { field: 'status', operator: 'equals', value: 'Open' }, { field: 'owner', operator: 'contains_any_of', value: [myId] }]) };
const out = { who: process.env.WHO, truth, turns: [] };
const qs = process.env.WHO === 'ndc-staging-owner' ? ['How many open tickets do I have?', 'how many tickets are assigned to me'] : ['How many open tickets do I have?', 'Count the tickets with status Open that I can see'];
for (const q of qs) for (let k = 0; k < 2; k++) { const r = await ask(q); const s = short(r); let turn = null; const tid = r.final?.turn_id; if (tid) { const t = await api('GET', `/agents/tia/turns/${tid}`); turn = { status: t.j?.data?.status, error_code: t.j?.data?.error_code }; } out.turns.push({ q, try: k + 1, text: s.text, cards: s.cards, err: s.err, turn }); }
return out;
