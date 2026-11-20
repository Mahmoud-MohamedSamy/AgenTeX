// sample: tickets from r19 ledger/BP (yesterday) and today
const ids = { '4177(16Nov)': 'caf13024-c4e6-45b1-9094-93a4f235dfad', '4182(16Nov)': '4ad8caa5-4f11-404c-b25b-8235103d4090', '4174(16Nov)': 'c3a5d3af-76ee-4aea-8a3c-ff71d954e03f', '4829(plain today)': '5e50f93c-dbe2-4b64-9e33-1536a241469c', '4807(bp today)': '60968417-89fa-4b5e-9d97-e4bf8d93e2a4' };
const o = {}; for (const [k, id] of Object.entries(ids)) { const h = L((await api('GET', `/desk/tickets/${id}/history`)).j?.data); o[k] = h.map(x => x.occurred_at.slice(5, 16) + ' ' + x.action.replace('ticket.', '') + (x.field_key ? ':' + x.field_key : '') + (x.field_key === 'closed_at' || x.field_key === 'resolution_time' ? '=' + JSON.stringify(x.new_value) : '')).slice(0, 14); }
return o;
