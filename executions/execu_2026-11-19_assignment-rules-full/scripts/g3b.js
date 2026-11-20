const r = await patchT(IDS.TK_Y3, { department: IDS.DA }); const m = await api('POST', '/desk/tickets/' + IDS.TK_Y3 + '/move', { department_id: IDS.DA });
const t2 = (await api('GET', '/desk/tickets/' + IDS.TK_Y2)).j.data;
return { patch: r.s, err: E(r), move: m.s, moveErr: E(m), y2: { owner: await ownN(IDS.TK_Y2), deskOwner: nmU(t2.owner_id || t2.owner_user_id), in_backlog: t2.in_backlog, keys: Object.keys(t2).join(',') } };
