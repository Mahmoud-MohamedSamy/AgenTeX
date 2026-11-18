const h = await histRaw('f5955ca9-75d0-460d-8e00-0c50d26f25f8');
return h.filter(x => /blueprint_transition/.test(x.action)).map(x => ({ action: x.action, actor: x.actor && (x.actor.name || x.actor.type || x.actor), summary: x.summary }));
