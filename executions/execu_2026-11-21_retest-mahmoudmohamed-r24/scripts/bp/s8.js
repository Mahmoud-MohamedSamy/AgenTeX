const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {};
for (const k of ['k1', 'r3']) { const id = J[k]; o[k] = { rec: (await rec(id)).status, desk: (await api('GET', '/desk/tickets/' + id)).j?.data?.status, hist: (await histRaw(id)).filter(x => /transition|status/.test(x.action)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' actor=' + (x.actor?.user_id === AG_A ? 'CES2' : x.actor?.user_id === OWNER ? 'OWNER' : x.actor?.kind) + ' ' + JSON.stringify(x.new_value || x.summary?.transition_name || '').slice(0, 60)) }; }
return o;
