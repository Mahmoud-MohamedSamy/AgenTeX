const CEO = '1499272000000008337'; const r = await api(page, 'PATCH', 'roles/' + CEO, { shareDataWithPeers: PEERS }); out.peers = r.s + ' ' + r.t.slice(0, 120);
