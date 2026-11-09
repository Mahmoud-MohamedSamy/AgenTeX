const h = await api('GET', '/desk/tickets/29049c30-eda1-46e8-a4b5-85ecbe4acc40/activity');
return fin({ hist: arr(h.j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 200)) });
