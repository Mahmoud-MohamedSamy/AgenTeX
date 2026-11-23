// Actions batch 2: On Edit on settled tickets (followers, remove tags, change layout), owner target kinds.
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', tagD = 'ba388a87-99b7-491e-ab91-2bba95ccd60a', TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a';
const out = {};
// owner target kinds accepted by the API
const kinds = {};
for (const [k, v] of [['Role', '7972984b-b5cc-034a-bd96-6de61e3937d0'], ['OrgUnit', '7972984b-b5cc-034a-bd96-6de61e3937d0'], ['Profile', 'Desk Supervisor'], ['UserField', 'created_by'], ['Team', '00000000-0000-0000-0000-000000000001'], ['AssignmentRule', '00000000-0000-0000-0000-000000000001'], ['Bogus', 'x']]) {
  const r = await mkRule('AC2k' + k, { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: k, ownerValue: v }], { active: false });
  kinds[k] = r.s + ' ' + (r.err || '').slice(0, 160); if (r.id) await api('DELETE', '/workflow/rules/' + r.id);
}
out.ownerKinds = kinds;
const rF = await mkRule('AC2f', { kind: 'RecordUpdated' }, [{ type: 'AddTicketFollowers', followerUserIds: [TU1, DEV2] }]);
const rT = await mkRule('AC2t', { kind: 'RecordUpdated' }, [{ type: 'RemoveTags', tagIds: [tagD] }]);
const rL = await mkRule('AC2l', { kind: 'RecordUpdated' }, [{ type: 'ChangeTicketLayout', ticketLayoutId: TLR }]);
const rR = await mkRule('AC2r', { kind: 'RecordUpdated' }, [{ type: 'AddTags', tagIds: [tagD], mode: 'replace' }]);
const tF = await mkTicket('AC2f', { department: DEPT2 }); const tT = await mkTicket('AC2t', { department: DEPT2 }); const tL = await mkTicket('AC2l', { department: DEPT2 }); const tR = await mkTicket('AC2r', { department: DEPT2 });
await sleep(20000);
await api('POST', `/desk/tickets/${tT.id}/tags`, { tag_ids: [tagC, tagD] }); await api('POST', `/desk/tickets/${tR.id}/tags`, { tag_ids: [tagC] });
await sleep(15000);
for (const t of [tF, tT, tL, tR]) await patchTicket(t.id, { classification: 'others' });
await sleep(40000);
const tk = async id => (await api('GET', `/desk/tickets/${id}`)).j?.data || {};
const dsp = async (t, r) => (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 120) + ')' : '')));
out.followers = { count: (await tk(tF.id)).followers_count, dispatch: await dsp(tF, rF) };
out.removeTags = { tags: (await getTicket(tT.id)).tags, dispatch: await dsp(tT, rT) };
out.layout = { layout: JSON.stringify((await tk(tL.id)).layout || (await tk(tL.id)).layout_id), dispatch: await dsp(tL, rL) };
out.replaceTags = { tags: (await getTicket(tR.id)).tags, dispatch: await dsp(tR, rR) };
fs.writeFileSync(RUN + '/out/ac2.json', JSON.stringify(out, null, 1));
return out;
