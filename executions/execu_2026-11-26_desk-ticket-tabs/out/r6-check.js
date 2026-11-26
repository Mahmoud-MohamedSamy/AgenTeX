const out = {};
for (const k of ['a', 'b', 'd']) { const h = await api.O('GET', TK(ST.RN[k]) + '/history'); out[k] = arr(h.j?.data?.items || h.j?.data).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + (x.new_value ? '=' + String(JSON.stringify(x.new_value)).slice(0, 30) : '') + ' by ' + (x.actor?.label || x.actor?.kind)).join(' | '); }
return out;
