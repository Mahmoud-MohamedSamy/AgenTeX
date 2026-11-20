const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {};
const who = x => x === AG_A ? 'CES2' : x === OWNER ? 'OWNER' : (x || '').slice(0, 8);
for (const k of ['K1', 'K3', 'SR', 'SX', 'SN', 'K2', 'SF', 'XF', 'XR']) { const id = J.t[k]; const h = L((await api('GET', `/desk/tickets/${id}/history`)).j?.data); const sh = L((await api('GET', '/desk/tickets/' + id + '/shares')).j?.data);
  o[k] = J.n[k] + ' st=' + (await api('GET', '/desk/tickets/' + id)).j?.data?.status + ' ownerTrans=' + JSON.stringify(await trans(id)) + ' shares=' + JSON.stringify(sh.map(x => (x.department_id === CS ? 'CS' : x.department_id.slice(0, 8)) + ':' + x.access)) + ' hist=' + h.filter(x => /transition|status|blueprint/.test(x.action)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action.replace('ticket.', '') + ' ' + who(x.actor?.user_id)).join(', '); }
const bp = (await getBp(made.bps[0])) || {}; o.tkIssues = bp.ownerIssues; o.tkNoActive = bp.transitionsWithoutActiveOwner;
return o;
