const o = {}; const y = IDS.TK_ESC_Y2, n = IDS.TK_ESC_N2;
o.esc = fl((await api('GET', '/modules/' + T + '/records/' + y)).j.data).sla_escalated;
o.ed = [(await api('PATCH', '/modules/' + T + '/records/' + y, body({ priority: 'Medium' }))).s, (await api('PATCH', '/modules/' + T + '/records/' + n, body({ priority: 'Medium' }))).s];
o.y = await waitO(y, 60); o.n = await waitO(n, 15);
const h = (await api('GET', '/desk/tickets/' + y + '/history')).j; o.hist = ((h && h.data && (h.data.items || h.data.events || h.data)) || []).slice(0, 4).map(e => (e.occurred_at || '').slice(11, 19) + ' ' + e.action + ' ' + (e.field_key || '') + ' ' + JSON.stringify(e.new_value) + ' ' + JSON.stringify(e.source || '').slice(0, 80));
L = [R_('B-06', o.y.owner === 'A1' && !o.n.owner ? 'Pass' : 'Fail', 'Retest 20 Nov: no "Is Escalated" field by that name, but "SLA Escalated" (boolean, equals) is the same flag. RR rule "subject starts QA AR ESC AND SLA Escalated = true" (create+update), SLA policy with 1-min response + level-1 escalation: escalated ticket edited -> owner ' + o.y.owner + ' in ' + o.y.s + ' s; non-escalated control -> ' + o.n.owner + '. Edit before escalation left the ticket unassigned.')];
return o;
