const id = '4ad8caa5-4f11-404c-b25b-8235103d4090'; const r = await rec(id);
const h = (await histRaw(id)).filter(x => /transition|status/.test(x.action)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' actor=' + (x.actor?.user_id === AG_A ? 'CES2' : x.actor?.user_id === OWNER ? 'OWNER' : x.actor?.kind) + ' ' + JSON.stringify(x.new_value || x.summary?.transition_name || ''));
return { status: r.status, owner: r.owner === OWNER ? 'ndc-staging-owner' : r.owner, hist: h };
