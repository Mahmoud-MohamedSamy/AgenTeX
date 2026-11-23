const st = await api('GET', '/agents/tia/status'); const cv = await api('GET', '/agents/tia/conversations');
const r = process.env.ASK ? await ask(process.env.ASK) : null;
return { status: st.s, data: st.j?.data, err: st.j?.error?.code, convs: arr(cv.j?.data).length, convIds: arr(cv.j?.data).map(c => c.id.slice(0,8)), ask: r && short(r) };
