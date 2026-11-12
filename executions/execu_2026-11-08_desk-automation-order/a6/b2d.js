const a = await mkT('I15Y', 'plain source'), b = await mkT('I15Y', 'plain target'); await sleep(3000);
const tries = {};
for (const [k, body] of [['master+sources', { master_ticket_id: b, source_ticket_ids: [a], cc_list_from: 'target' }], ['target+sources', { target_ticket_id: b, source_ticket_ids: [a], cc_list_from: 'target' }]]) tries[k] = E(await api('POST', '/desk/tickets/merge', body));
const m2 = await api('POST', `/desk/tickets/${b}/merge`, { source_ticket_ids: [a], cc_list_from: 'target' }); tries['/tickets/{target}/merge'] = E(m2);
out('ids', { a: a.slice(0, 8), b: b.slice(0, 8) }); out('control', tries); out('cleanup', await cleanAll()); log(JSON.stringify(R, null, 1));
