const s = async id => { const it = (await api.O('GET', '/desk/approvals/' + id)).j?.data?.item; return it?.status + ' ' + (it?.approval?.decision_comment || it?.submission?.decision_reason || ''); };
return { a1: await s(ST.N.a1), a2: await s(ST.N.a2), a3: await s(ST.N.a3) };
