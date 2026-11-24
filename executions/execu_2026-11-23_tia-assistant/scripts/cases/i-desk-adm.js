const out = {};
out['I-15'] = short(await ask('How is my team doing this week? Give tickets closed and average first response time, and say the date range.'));
out['I-16'] = short(await ask('What did Customer Experience Specialists 2 work on today?'));
out['I-22'] = short(await ask('How many chats are waiting right now?'));
fs.writeFileSync(RUN + '/out/i-desk-adm.json', JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 500) + ` (refs ${v.refs}, cards ${v.cards})`]));
